import SwiftUI

struct RegisterView: View {
    @StateObject private var viewModel = RegisterViewModel()
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            VStack(spacing: 8) {
                Image(systemName: "person.badge.plus")
                    .font(.system(size: 50))
                    .foregroundColor(.blue)
                
                Text("Create Account")
                    .font(.title)
                    .fontWeight(.bold)
                
                Text("Start your learning journey today")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
            .padding(.top, 20)
            .padding(.bottom, 32)
            
            // Form
            ScrollView {
                VStack(spacing: 16) {
                    CustomTextField(
                        title: "Full Name",
                        placeholder: "Enter your full name",
                        text: $viewModel.name
                    )
                    
                    CustomTextField(
                        title: "Email",
                        placeholder: "Enter your email",
                        text: $viewModel.email,
                        keyboardType: .emailAddress,
                        autocapitalization: .never,
                        errorMessage: viewModel.emailError
                    )
                    
                    CustomTextField(
                        title: "Password",
                        placeholder: "Create a password (min 8 chars)",
                        text: $viewModel.password,
                        isSecure: true,
                        errorMessage: viewModel.passwordError
                    )
                    
                    CustomTextField(
                        title: "Confirm Password",
                        placeholder: "Confirm your password",
                        text: $viewModel.confirmPassword,
                        isSecure: true,
                        errorMessage: viewModel.confirmPasswordError
                    )
                    
                    PrimaryButton(
                        title: "Create Account",
                        action: {
                            Task {
                                await viewModel.register()
                            }
                        },
                        isLoading: viewModel.isLoading,
                        isDisabled: !viewModel.isFormValid
                    )
                    .padding(.top, 8)
                }
                .padding(.horizontal, 24)
            }
            
            Spacer()
            
            // Footer
            HStack(spacing: 4) {
                Text("Already have an account?")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                Button("Sign In") {
                    dismiss()
                }
                .font(.subheadline)
                .fontWeight(.semibold)
                .foregroundColor(.blue)
            }
            .padding(.bottom, 32)
        }
        .loading(viewModel.isLoading, message: "Creating account...")
        .alert("Error", isPresented: $viewModel.showError) {
            Button("OK", role: .cancel) {
                viewModel.clearError()
            }
        } message: {
            Text(viewModel.errorMessage ?? "An error occurred")
        }
        .alert("Success!", isPresented: $viewModel.showSuccess) {
            Button("Continue", role: .cancel) {
                dismiss()
            }
        } message: {
            Text("Your account has been created successfully.")
        }
        .navigationDestination(isPresented: $viewModel.isRegistered) {
            ProfileView()
                .navigationBarBackButtonHidden(true)
        }
    }
}

#Preview {
    NavigationStack {
        RegisterView()
    }
}
