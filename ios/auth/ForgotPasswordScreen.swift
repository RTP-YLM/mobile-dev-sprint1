import SwiftUI

// MARK: - Forgot Password Screen
/// Password recovery screen with email input
/// หน้ากู้คืนรหัสผ่าน
struct ForgotPasswordScreen: View {
    @State private var email = ""
    @State private var emailError: String?
    @State private var generalError: String?
    @State private var isLoading = false
    @State private var isSuccess = false
    @State private var showSuccessAlert = false
    @Environment(\.dismiss) private var dismiss
    
    // Focus state for keyboard navigation
    @FocusState private var isEmailFocused: Bool
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Success state view
                    if isSuccess {
                        SuccessView(email: email)
                    } else {
                        // Header with icon
                        VStack(spacing: 16) {
                            Image(systemName: "lock.rotation")
                                .resizable()
                                .scaledToFit()
                                .frame(width: 80, height: 80)
                                .foregroundColor(.blue)
                                .padding()
                                .background(
                                    Circle()
                                        .fill(Color.blue.opacity(0.1))
                                        .frame(width: 140, height: 140)
                                )
                                .accessibilityHidden(true)
                            
                            Text("Forgot Password?")
                                .font(.largeTitle)
                                .fontWeight(.bold)
                                .accessibilityLabel("Forgot Password heading")
                            
                            Text("Enter your email address and we'll send you instructions to reset your password.")
                                .font(.body)
                                .multilineTextAlignment(.center)
                                .foregroundColor(.secondary)
                                .padding(.horizontal)
                                .dynamicTypeSize(.large ... .accessibility3)
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
                        
                        // Email input field
                        VStack(spacing: 24) {
                            CustomTextField(
                                title: "Email Address",
                                placeholder: "Enter your registered email",
                                text: $email,
                                keyboardType: .emailAddress,
                                autocapitalization: .never,
                                errorMessage: emailError,
                                onCommit: {
                                    sendResetRequest()
                                }
                            )
                            .focused($isEmailFocused)
                            .textContentType(.emailAddress)
                            .onChange(of: email) { _ in
                                validateEmail()
                            }
                            
                            // Send button
                            PrimaryButton(
                                title: "Send Reset Link",
                                action: {
                                    sendResetRequest()
                                },
                                isLoading: isLoading,
                                isEnabled: isFormValid
                            )
                            
                            // Back to login link
                            Button {
                                dismiss()
                            } label: {
                                HStack(spacing: 4) {
                                    Image(systemName: "arrow.left")
                                    Text("Back to Login")
                                }
                                .font(.subheadline)
                                .foregroundColor(.blue)
                            }
                            .accessibilityLabel("Go back to login screen")
                        }
                        .padding(.horizontal)
                        
                        Spacer()
                    }
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    if isSuccess {
                        Button("Done") {
                            dismiss()
                        }
                    }
                }
            }
            .alert("Reset Link Sent", isPresented: $showSuccessAlert) {
                Button("OK") {
                    withAnimation {
                        isSuccess = true
                    }
                }
            } message: {
                Text("We've sent password reset instructions to \(email). Please check your inbox.")
            }
        }
    }
    
    // MARK: - Computed Properties
    
    /// Checks if email is valid for submission
    private var isFormValid: Bool {
        !email.isEmpty && emailError == nil
    }
    
    // MARK: - Validation
    
    /// Validates email format in real-time
    private func validateEmail() {
        if email.isEmpty {
            emailError = nil
        } else if !Validation.isValidEmail(email) {
            emailError = "Please enter a valid email address"
        } else {
            emailError = nil
        }
    }
    
    // MARK: - Actions
    
    /// Sends password reset request
    private func sendResetRequest() {
        // Clear previous errors
        generalError = nil
        
        // Validate email
        if email.isEmpty {
            emailError = "Email is required"
            isEmailFocused = true
            return
        }
        
        if !Validation.isValidEmail(email) {
            emailError = "Please enter a valid email address"
            isEmailFocused = true
            return
        }
        
        // Show loading
        isLoading = true
        
        // Simulate API call
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            isLoading = false
            
            // Simulate success - in production this would call your API
            showSuccessAlert = true
        }
    }
}

// MARK: - Success View
/// View shown after successful password reset request
struct SuccessView: View {
    let email: String
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        VStack(spacing: 24) {
            Spacer()
            
            // Success icon
            ZStack {
                Circle()
                    .fill(Color.green.opacity(0.1))
                    .frame(width: 140, height: 140)
                
                Image(systemName: "envelope.fill")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 60, height: 60)
                    .foregroundColor(.green)
            }
            .accessibilityHidden(true)
            
            // Success message
            VStack(spacing: 12) {
                Text("Check Your Email")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .accessibilityLabel("Check Your Email heading")
                
                Text("We've sent password reset instructions to:")
                    .font(.body)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                
                Text(email)
                    .font(.headline)
                    .foregroundColor(.primary)
                    .padding(.vertical, 8)
                    .padding(.horizontal, 16)
                    .background(Color.blue.opacity(0.1))
                    .cornerRadius(8)
                    .accessibilityLabel("Email address: \(email)")
                
                Text("If you don't see the email, check your spam folder or try again.")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.top, 8)
            }
            .padding(.horizontal)
            
            Spacer()
            
            // Action buttons
            VStack(spacing: 16) {
                PrimaryButton(
                    title: "Back to Login",
                    action: {
                        dismiss()
                    }
                )
                
                Button("Resend Email") {
                    // Resend logic
                }
                .font(.subheadline)
                .foregroundColor(.blue)
                .accessibilityLabel("Resend reset email")
            }
            .padding(.horizontal)
            .padding(.bottom, 30)
        }
    }
}

// MARK: - Preview
struct ForgotPasswordScreen_Previews: PreviewProvider {
    static var previews: some View {
        ForgotPasswordScreen()
            .previewDevice("iPhone 14")
        
        ForgotPasswordScreen()
            .previewDevice("iPhone 14")
            .preferredColorScheme(.dark)
        
        // Accessibility preview
        ForgotPasswordScreen()
            .previewDevice("iPhone 14")
            .environment(\.dynamicTypeSize, .accessibility3)
    }
}
