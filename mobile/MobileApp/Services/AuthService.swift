import Foundation
import Combine

protocol AuthServiceProtocol {
    func login(email: String, password: String) async throws -> AuthResponse
    func register(email: String, password: String, name: String) async throws -> AuthResponse
    func refreshToken() async throws -> TokenRefreshResponse
    func forgotPassword(email: String) async throws
    func logout() async throws
    func getCurrentUser() async throws -> UserProfile
    var isAuthenticated: Bool { get }
}

class AuthService: AuthServiceProtocol {
    static let shared = AuthService()
    
    private let networkManager: NetworkManagerProtocol
    private let keychain: KeychainHelper
    
    init(networkManager: NetworkManagerProtocol = NetworkManager.shared,
         keychain: KeychainHelper = KeychainHelper.shared) {
        self.networkManager = networkManager
        self.keychain = keychain
    }
    
    var isAuthenticated: Bool {
        return keychain.isLoggedIn
    }
    
    func login(email: String, password: String) async throws -> AuthResponse {
        let response = try await networkManager.request(
            AuthEndpoint.login(email: email, password: password),
            type: AuthResponse.self
        )
        
        // Save tokens to keychain
        _ = keychain.saveAccessToken(response.accessToken)
        _ = keychain.saveRefreshToken(response.refreshToken)
        _ = keychain.saveUser(response.user)
        
        return response
    }
    
    func register(email: String, password: String, name: String) async throws -> AuthResponse {
        let response = try await networkManager.request(
            AuthEndpoint.register(email: email, password: password, name: name),
            type: AuthResponse.self
        )
        
        // Save tokens to keychain
        _ = keychain.saveAccessToken(response.accessToken)
        _ = keychain.saveRefreshToken(response.refreshToken)
        _ = keychain.saveUser(response.user)
        
        return response
    }
    
    func refreshToken() async throws -> TokenRefreshResponse {
        guard let refreshToken = keychain.getRefreshToken() else {
            throw APIError.unauthorized
        }
        
        let response = try await networkManager.request(
            AuthEndpoint.refresh(token: refreshToken),
            type: TokenRefreshResponse.self
        )
        
        // Save new access token
        _ = keychain.saveAccessToken(response.accessToken)
        
        return response
    }
    
    func forgotPassword(email: String) async throws {
        try await networkManager.request(
            AuthEndpoint.forgotPassword(email: email)
        )
    }
    
    func logout() async throws {
        do {
            try await networkManager.request(AuthEndpoint.logout)
        } catch {
            // Even if logout fails on server, clear local data
        }
        
        // Clear all tokens
        keychain.clearAllTokens()
    }
    
    func getCurrentUser() async throws -> UserProfile {
        return try await networkManager.request(
            UserEndpoint.getMe,
            type: UserProfile.self
        )
    }
    
    func autoLogin() async throws -> Bool {
        guard isAuthenticated else {
            return false
        }
        
        do {
            // Try to get current user to verify token is still valid
            _ = try await getCurrentUser()
            return true
        } catch APIError.unauthorized {
            // Try to refresh token
            do {
                _ = try await refreshToken()
                return true
            } catch {
                // Refresh failed, clear tokens
                keychain.clearAllTokens()
                return false
            }
        } catch {
            return false
        }
    }
}
