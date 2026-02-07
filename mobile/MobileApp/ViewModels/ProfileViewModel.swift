import Foundation
import SwiftUI

@MainActor
class ProfileViewModel: ObservableObject {
    @Published var user: User?
    @Published var userProfile: UserProfile?
    @Published var isLoading: Bool = false
    @Published var isLoggingOut: Bool = false
    @Published var errorMessage: String?
    @Published var showError: Bool = false
    @Published var isLoggedOut: Bool = false
    
    private let authService: AuthServiceProtocol
    
    init(authService: AuthServiceProtocol = AuthService.shared) {
        self.authService = authService
        self.user = KeychainHelper.shared.getUser()
    }
    
    func loadUserProfile() async {
        isLoading = true
        errorMessage = nil
        
        do {
            userProfile = try await authService.getCurrentUser()
            user = userProfile?.user
        } catch let error as APIError {
            if case .unauthorized = error {
                // Token expired, try to auto-login
                let success = try? await authService.autoLogin()
                if success == true {
                    // Retry loading
                    do {
                        userProfile = try await authService.getCurrentUser()
                        user = userProfile?.user
                    } catch {
                        errorMessage = error.localizedDescription
                        showError = true
                    }
                } else {
                    isLoggedOut = true
                }
            } else {
                errorMessage = error.localizedDescription
                showError = true
            }
        } catch {
            errorMessage = "Failed to load profile"
            showError = true
        }
        
        isLoading = false
    }
    
    func logout() async {
        isLoggingOut = true
        
        do {
            try await authService.logout()
            isLoggedOut = true
        } catch {
            // Even if logout fails, clear local state
            KeychainHelper.shared.clearAllTokens()
            isLoggedOut = true
        }
        
        isLoggingOut = false
    }
    
    var userInitials: String {
        guard let name = user?.name else { return "?" }
        let components = name.components(separatedBy: " ")
        let initials = components.compactMap { $0.first }.prefix(2)
        return String(initials).uppercased()
    }
    
    var formattedJoinDate: String {
        guard let date = user?.createdAt else { return "Unknown" }
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        return formatter.string(from: date)
    }
}
