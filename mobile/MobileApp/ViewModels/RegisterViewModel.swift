import Foundation
import SwiftUI

@MainActor
class RegisterViewModel: ObservableObject {
    @Published var name: String = ""
    @Published var email: String = ""
    @Published var password: String = ""
    @Published var confirmPassword: String = ""
    @Published var isLoading: Bool = false
    @Published var errorMessage: String?
    @Published var showError: Bool = false
    @Published var isRegistered: Bool = false
    @Published var showSuccess: Bool = false
    
    private let authService: AuthServiceProtocol
    
    init(authService: AuthServiceProtocol = AuthService.shared) {
        self.authService = authService
    }
    
    var isFormValid: Bool {
        !name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty &&
        !email.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty &&
        !password.isEmpty &&
        !confirmPassword.isEmpty
    }
    
    var emailError: String? {
        let trimmed = email.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed.isEmpty { return nil }
        if Validators.validateEmail(trimmed) != nil {
            return "Please enter a valid email"
        }
        return nil
    }
    
    var passwordError: String? {
        if password.isEmpty { return nil }
        if password.count < 8 {
            return "Password must be at least 8 characters"
        }
        return nil
    }
    
    var confirmPasswordError: String? {
        if confirmPassword.isEmpty { return nil }
        if password != confirmPassword {
            return "Passwords do not match"
        }
        return nil
    }
    
    func register() async {
        let trimmedName = name.trimmingCharacters(in: .whitespacesAndNewlines)
        let trimmedEmail = email.trimmingCharacters(in: .whitespacesAndNewlines)
        
        // Validate form
        let validationErrors = Validators.validateRegister(
            email: trimmedEmail,
            password: password,
            confirmPassword: confirmPassword,
            name: trimmedName
        )
        
        if !validationErrors.isEmpty {
            errorMessage = validationErrors.first?.localizedDescription
            showError = true
            return
        }
        
        isLoading = true
        errorMessage = nil
        
        do {
            _ = try await authService.register(
                email: trimmedEmail,
                password: password,
                name: trimmedName
            )
            showSuccess = true
            isRegistered = true
        } catch let error as APIError {
            errorMessage = error.localizedDescription
            showError = true
        } catch {
            errorMessage = "An unexpected error occurred"
            showError = true
        }
        
        isLoading = false
    }
    
    func clearError() {
        errorMessage = nil
        showError = false
    }
}
