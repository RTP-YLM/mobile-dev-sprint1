import SwiftUI

// MARK: - Login Screen
/// Main login screen with email/password authentication
/// หน้าเข้าสู่ระบบด้วย email และรหัสผ่าน
struct LoginScreen: View {
    @State private var email = ""
    @State private var password = ""
    @State private var emailError: String?
    @State private var passwordError: String?
    @State private var generalError: String?
    @State private var isLoading = false
    @State private var isLoggedIn = false
    @State private var showForgotPassword = false
    @State private var showRegister = false
    
    // Focus states for keyboard navigation
    @FocusState private var focusedField: Field?
    enum Field: Hashable {
        case email, password
    }
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Header
                    VStack(spacing: 8) {
                        Text("Welcome Back")
                            .font(.largeTitle)
                            .fontWeight(.bold)
                            .accessibilityLabel("Welcome Back heading")
                        
                        Text("Sign in to continue")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                    .padding(.top, 40)
                    
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
                                focusedField = .password
                            }
                        )
                        .focused($focusedField, equals: .email)
                        .textContentType(.emailAddress)
                        .accessibilityLabel("Email address")
                        
                        CustomTextField(
                            title: "Password",
                            placeholder: "Enter your password",
                            text: $password,
                            isSecure: true,
                            errorMessage: passwordError,
                            onCommit: {
                                login()
                            }
                        )
                        .focused($focusedField, equals: .password)
                        .textContentType(.password)
                        .accessibilityLabel("Password")
                        
                        // Forgot password link
                        HStack {
                            Spacer()
                            Button("Forgot Password?") {
                                showForgotPassword = true
                            }
                            .font(.subheadline)
                            .foregroundColor(.blue)
                            .accessibilityLabel("Forgot your password")
                            .accessibilityHint("Navigate to password recovery screen")
                        }
                    }
                    .padding(.horizontal)
                    
                    // Login button
                    PrimaryButton(
                        title: "Sign In",
                        action: {
                            login()
                        },
                        isLoading: isLoading,
                        isEnabled: isFormValid
                    )
                    .padding(.horizontal)
                    .padding(.top, 8)
                    
                    // Divider with "or" text
                    HStack {
                        Rectangle()
                            .fill(Color.gray.opacity(0.3))
                            .frame(height: 1)
                        
                        Text("or")
                            .font(.subheadline)
                            .foregroundColor(.gray)
                        
                        Rectangle()
                            .fill(Color.gray.opacity(0.3))
                            .frame(height: 1)
                    }
                    .padding(.horizontal)
                    .accessibilityHidden(true)
                    
                    // Sign up link
                    HStack {
                        Text("Don't have an account?")
                            .foregroundColor(.secondary)
                        
                        Button("Sign Up") {
                            showRegister = true
                        }
                        .font(.headline)
                        .foregroundColor(.blue)
                        .accessibilityLabel("Create a new account")
                    }
                    .font(.subheadline)
                    
                    Spacer()
                }
            }
            .navigationDestination(isPresented: $showForgotPassword) {
                ForgotPasswordScreen()
            }
            .navigationDestination(isPresented: $showRegister) {
                RegisterScreen()
            }
            .navigationDestination(isPresented: $isLoggedIn) {
                // Navigate to main app screen
                Text("Welcome to the app!")
                    .font(.largeTitle)
                    .navigationBarBackButtonHidden(true)
            }
            .navigationBarTitleDisplayMode(.inline)
        }
    }
    
    // MARK: - Computed Properties
    
    /// Checks if form has valid input
    private var isFormValid: Bool {
        !email.isEmpty && !password.isEmpty && emailError == nil
    }
    
    // MARK: - Methods
    
    /// Performs login with validation
    private func login() {
        // Clear previous errors
        emailError = nil
        passwordError = nil
        generalError = nil
        
        // Validate email
        if email.isEmpty {
            emailError = "Email is required"
            focusedField = .email
            return
        }
        
        if !Validation.isValidEmail(email) {
            emailError = "Please enter a valid email address"
            focusedField = .email
            return
        }
        
        // Validate password
        if password.isEmpty {
            passwordError = "Password is required"
            focusedField = .password
            return
        }
        
        // Perform login
        isLoading = true
        
        // Simulate API call
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            isLoading = false
            
            // Simulate authentication (replace with actual API call)
            if email == "test@example.com" && password == "password" {
                isLoggedIn = true
            } else {
                // Show error for demo - in production this comes from API
                generalError = "Invalid email or password. Try test@example.com / password"
            }
        }
    }
}

// MARK: - Preview
struct LoginScreen_Previews: PreviewProvider {
    static var previews: some View {
        LoginScreen()
            .previewDevice("iPhone 14")
        
        LoginScreen()
            .previewDevice("iPhone 14")
            .preferredColorScheme(.dark)
        
        // Accessibility preview
        LoginScreen()
            .previewDevice("iPhone 14")
            .environment(\.dynamicTypeSize, .accessibility2)
    }
}
