import SwiftUI

struct ForgotPasswordView: View {
    @State private var email: String = ""
    @State private var isLoading: Bool = false
    @State private var showSuccess: Bool = false
    @State private var showError: Bool = false
    @State private var errorMessage: String = ""
    @Environment(\.dismiss) private var dismiss
    
    private var isFormValid: Bool {
        let trimmed = email.trimmingCharacters(in: .whitespacesAndNewlines)
        return Validators.validateEmail(trimmed) == nil && !trimmed.isEmpty
    }
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            VStack(spacing: 8) {
                Image(systemName: "key.fill")
                    .font(.system(size: 50))
                    .foregroundColor(.blue)
                
                Text("Reset Password")
                    .font(.title)
                    .fontWeight(.bold)
                
                Text("Enter your email to receive reset instructions")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
            }
            .padding(.top, 40)
            .padding(.bottom, 40)
            
            // Form
            VStack(spacing: 24) {
                CustomTextField(
                    title: "Email",
                    placeholder: "Enter your email address",
                    text: $email,
                    keyboardType: .emailAddress,
                    autocapitalization: .never
                )
                
                PrimaryButton(
                    title: "Send Reset Link",
                    action: {
                        Task {
                            await sendResetLink()
                        }
                    },
                    isLoading: isLoading,
                    isDisabled: !isFormValid
                )
                
                SecondaryButton(title: "Back to Login") {
                    dismiss()
                }
            }
            .padding(.horizontal, 24)
            
            Spacer()
        }
        .loading(isLoading, message: "Sending...")
        .alert("Check Your Email", isPresented: $showSuccess) {
            Button("OK") {
                dismiss()
            }
        } message: {
            Text("If an account exists with this email, you will receive password reset instructions.")
        }
        .alert("Error", isPresented: $showError) {
            Button("OK", role: .cancel) {}
        } message: {
            Text(errorMessage)
        }
    }
    
    private func sendResetLink() async {
        isLoading = true
        
        do {
            try await AuthService.shared.forgotPassword(
                email: email.trimmingCharacters(in: .whitespacesAndNewlines)
            )
            showSuccess = true
        } catch let error as APIError {
            errorMessage = error.localizedDescription
            showError = true
        } catch {
            errorMessage = "Failed to send reset link"
            showError = true
        }
        
        isLoading = false
    }
}

#Preview {
    NavigationStack {
        ForgotPasswordView()
    }
}
