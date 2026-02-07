import SwiftUI

struct LoginView: View {
    @StateObject private var viewModel = LoginViewModel()
    @State private var showRegister: Bool = false
    @State private var showForgotPassword: Bool = false
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Header
                VStack(spacing: 8) {
                    Image(systemName: "book.fill")
                        .font(.system(size: 60))
                        .foregroundColor(.blue)
                    
                    Text("Welcome Back")
                        .font(.title)
                        .fontWeight(.bold)
                    
                    Text("Sign in to continue your learning journey")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                .padding(.top, 40)
                .padding(.bottom, 40)
                
                // Form
                VStack(spacing: 20) {
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
                        placeholder: "Enter your password",
                        text: $viewModel.password,
                        isSecure: true
                    )
                    
                    HStack {
                        Spacer()
                        SecondaryButton(title: "Forgot password?") {
                            showForgotPassword = true
                        }
                    }
                    
                    PrimaryButton(
                        title: "Sign In",
                        action: {
                            Task {
                                await viewModel.login()
                            }
                        },
                        isLoading: viewModel.isLoading,
                        isDisabled: !viewModel.isFormValid
                    )
                    .padding(.top, 8)
                }
                .padding(.horizontal, 24)
                
                Spacer()
                
                // Footer
                HStack(spacing: 4) {
                    Text("Don't have an account?")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                    
                    Button("Sign Up") {
                        showRegister = true
                    }
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundColor(.blue)
                }
                .padding(.bottom, 32)
            }
            .loading(viewModel.isLoading, message: "Signing in...")
            .alert("Error", isPresented: $viewModel.showError) {
                Button("OK", role: .cancel) {
                    viewModel.clearError()
                }
            } message: {
                Text(viewModel.errorMessage ?? "An error occurred")
            }
            .navigationDestination(isPresented: $showRegister) {
                RegisterView()
            }
            .navigationDestination(isPresented: $showForgotPassword) {
                ForgotPasswordView()
            }
            .navigationDestination(isPresented: $viewModel.isLoggedIn) {
                ProfileView()
                    .navigationBarBackButtonHidden(true)
            }
        }
    }
}

#Preview {
    LoginView()
}
