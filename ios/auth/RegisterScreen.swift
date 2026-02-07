import SwiftUI

// MARK: - Register Screen
/// User registration screen with email, password, and confirm password
/// หน้าสมัครสมาชิกใหม่
struct RegisterScreen: View {
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var emailError: String?
    @State private var passwordError: String?
    @State private var confirmPasswordError: String?
    @State private var generalError: String?
    @State private var isLoading = false
    @State private var isRegistered = false
    @State private var passwordStrength: Validation.PasswordStrength = .weak
    @State private var showSuccessAlert = false
    
    // Focus states for keyboard navigation
    @FocusState private var focusedField: Field?
    enum Field: Hashable {
        case email, password, confirmPassword
    }
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    // Header
                    VStack(spacing: 8) {
                        Text("Create Account")
                            .font(.largeTitle)
                            .fontWeight(.bold)
                            .accessibilityLabel("Create Account heading")
                        
                        Text("Sign up to get started")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                    .padding(.top, 20)
                    
                    // Error banner
                    if let error = generalError {
                        ErrorBanner(message: error) {
                            withAnimation {
                                generalError = nil
                            }
                        }
                        .padding(.horizontal)
                        .transition(.move(edge: .top))
                    }
                    
                    // Form fields
                    VStack(spacing: 16) {
                        CustomTextField(
                            title: "Email",
                            placeholder: "Enter your email",
                            text: $email,
                            keyboardType: .emailAddress,
                            autocapitalization: .never,
                            errorMessage: emailError,
                            onCommit: {
                                validateEmail()
                                focusedField = .password
                            }
                        )
                        .focused($focusedField, equals: .email)
                        .textContentType(.emailAddress)
                        .onChange(of: email) { _ in
                            validateEmail()
                        }
                        
                        // Password field with strength indicator
                        VStack(alignment: .leading, spacing: 4) {
                            CustomTextField(
                                title: "Password",
                                placeholder: "Create a password",
                                text: $password,
                                isSecure: true,
                                errorMessage: passwordError,
                                onCommit: {
                                    focusedField = .confirmPassword
                                }
                            )
                            .focused($focusedField, equals: .password)
                            .textContentType(.newPassword)
                            .onChange(of: password) { newValue in
                                validatePassword(newValue)
                            }
                            
                            // Password strength indicator
                            if !password.isEmpty {
                                PasswordStrengthIndicator(
                                    strength: passwordStrength,
                                    message: passwordError ?? ""
                                )
                            }
                            
                            // Password requirements hint
                            Text("At least 8 characters with uppercase, lowercase, number, and special character")
                                .font(.caption)
                                .foregroundColor(.secondary)
                                .padding(.top, 4)
                        }
                        
                        CustomTextField(
                            title: "Confirm Password",
                            placeholder: "Re-enter your password",
                            text: $confirmPassword,
                            isSecure: true,
                            errorMessage: confirmPasswordError,
                            onCommit: {
                                register()
                            }
                        )
                        .focused($focusedField, equals: .confirmPassword)
                        .textContentType(.newPassword)
                        .onChange(of: confirmPassword) { _ in
                            validateConfirmPassword()
                        }
                    }
                    .padding(.horizontal)
                    
                    // Terms and conditions checkbox
                    HStack(alignment: .top, spacing: 12) {
                        Image(systemName: "checkmark.square.fill")
                            .foregroundColor(.blue)
                            .accessibilityHidden(true)
                        
                        Text("By signing up, you agree to our ")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        + Text("Terms of Service")
                            .font(.caption)
                            .foregroundColor(.blue)
                        + Text(" and ")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        + Text("Privacy Policy")
                            .font(.caption)
                            .foregroundColor(.blue)
                    }
                    .padding(.horizontal)
                    .padding(.top, 8)
                    .accessibilityElement(children: .combine)
                    .accessibilityLabel("By signing up, you agree to our Terms of Service and Privacy Policy")
                    
                    // Register button
                    PrimaryButton(
                        title: "Create Account",
                        action: {
                            register()
                        },
                        isLoading: isLoading,
                        isEnabled: isFormValid
                    )
                    .padding(.horizontal)
                    .padding(.top, 8)
                    
                    // Already have account link
                    HStack {
                        Text("Already have an account?")
                            .foregroundColor(.secondary)
                        
                        Button("Sign In") {
                            // Navigate back to login
                        }
                        .font(.headline)
                        .foregroundColor(.blue)
                    }
                    .font(.subheadline)
                    .padding(.top, 8)
                    
                    Spacer()
                }
            }
            .navigationDestination(isPresented: $isRegistered) {
                // Navigate to email verification or main screen
                Text("Registration Successful!")
                    .font(.largeTitle)
                    .navigationBarBackButtonHidden(true)
            }
            .navigationBarTitleDisplayMode(.inline)
            .alert("Success", isPresented: $showSuccessAlert) {
                Button("OK") {
                    isRegistered = true
                }
            } message: {
                Text("Your account has been created successfully!")
            }
        }
    }
    
    // MARK: - Computed Properties
    
    /// Checks if all form fields are valid
    private var isFormValid: Bool {
        !email.isEmpty &&
        !password.isEmpty &&
        !confirmPassword.isEmpty &&
        emailError == nil &&
        passwordError == nil &&
        confirmPasswordError == nil
    }
    
    // MARK: - Validation Methods
    
    /// Validates email format
    private func validateEmail() {
        if email.isEmpty {
            emailError = nil
        } else if !Validation.isValidEmail(email) {
            emailError = "Please enter a valid email address"
        } else {
            emailError = nil
        }
    }
    
    /// Validates password strength
    private func validatePassword(_ newPassword: String) {
        if newPassword.isEmpty {
            passwordError = nil
            passwordStrength = .weak
            return
        }
        
        let result = Validation.validatePassword(newPassword)
        passwordStrength = result.strength
        
        if result.strength == .weak {
            passwordError = result.message
        } else {
            passwordError = nil
        }
        
        // Re-validate confirm password when password changes
        if !confirmPassword.isEmpty {
            validateConfirmPassword()
        }
    }
    
    /// Validates password confirmation
    private func validateConfirmPassword() {
        if confirmPassword.isEmpty {
            confirmPasswordError = nil
        } else if password != confirmPassword {
            confirmPasswordError = "Passwords do not match"
        } else {
            confirmPasswordError = nil
        }
    }
    
    // MARK: - Registration
    
    /// Performs registration with validation
    private func register() {
        // Clear previous errors
        generalError = nil
        
        // Validate all fields
        validateEmail()
        validatePassword(password)
        validateConfirmPassword()
        
        guard emailError == nil, passwordError == nil, confirmPasswordError == nil else {
            // Focus on first field with error
            if emailError != nil {
                focusedField = .email
            } else if passwordError != nil {
                focusedField = .password
            } else {
                focusedField = .confirmPassword
            }
            return
        }
        
        // Check if all fields are filled
        if email.isEmpty {
            emailError = "Email is required"
            focusedField = .email
            return
        }
        
        if password.isEmpty {
            passwordError = "Password is required"
            focusedField = .password
            return
        }
        
        if confirmPassword.isEmpty {
            confirmPasswordError = "Please confirm your password"
            focusedField = .confirmPassword
            return
        }
        
        // Perform registration
        isLoading = true
        
        // Simulate API call
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            isLoading = false
            
            // Simulate registration success
            showSuccessAlert = true
        }
    }
}

// MARK: - Password Strength Indicator
/// Visual indicator showing password strength
struct PasswordStrengthIndicator: View {
    let strength: Validation.PasswordStrength
    let message: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            // Strength bars
            HStack(spacing: 4) {
                ForEach(0..<3) { index in
                    Rectangle()
                        .fill(barColor(for: index))
                        .frame(height: 4)
                        .cornerRadius(2)
                }
            }
            
            // Strength text
            Text(message)
                .font(.caption)
                .foregroundColor(strength.color)
        }
        .padding(.top, 4)
    }
    
    private func barColor(for index: Int) -> Color {
        switch strength {
        case .weak:
            return index == 0 ? .red : Color.gray.opacity(0.3)
        case .medium:
            return index < 2 ? .orange : Color.gray.opacity(0.3)
        case .strong:
            return .green
        }
    }
}

// MARK: - Preview
struct RegisterScreen_Previews: PreviewProvider {
    static var previews: some View {
        RegisterScreen()
            .previewDevice("iPhone 14")
        
        RegisterScreen()
            .previewDevice("iPhone 14")
            .preferredColorScheme(.dark)
        
        // Accessibility preview
        RegisterScreen()
            .previewDevice("iPhone 14")
            .environment(\.dynamicTypeSize, .accessibility2)
    }
}
