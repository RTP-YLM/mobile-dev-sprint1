import Foundation
import SwiftUI

@MainActor
class LoginViewModel: ObservableObject {
    @Published var email: String = ""
    @Published var password: String = ""
    @Published var isLoading: Bool = false
    @Published var errorMessage: String?
    @Published var showError: Bool = false
    @Published var isLoggedIn: Bool = false
    
    private let authService: AuthServiceProtocol
    
    init(authService: AuthServiceProtocol = AuthService.shared) {
        self.authService = authService
    }
    
    var isFormValid: Bool {
        !email.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty &&
        !password.isEmpty
    }
    
    var emailError: String? {
        let trimmed = email.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed.isEmpty { return nil }
        if Validators.validateEmail(trimmed) != nil {
            return "Please enter a valid email"
        }
        return nil
    }
    
    func login() async {
        let trimmedEmail = email.trimmingCharacters(in: .whitespacesAndNewlines)
        
        // Validate form
        let validationErrors = Validators.validateLogin(email: trimmedEmail, password: password)
        if !validationErrors.isEmpty {
            errorMessage = validationErrors.first?.localizedDescription
            showError = true
            return
        }
        
        isLoading = true
        errorMessage = nil
        
        do {
            _ = try await authService.login(email: trimmedEmail, password: password)
            isLoggedIn = true
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
