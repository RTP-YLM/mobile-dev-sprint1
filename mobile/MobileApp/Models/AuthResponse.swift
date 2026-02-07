import Foundation

struct AuthResponse: Codable {
    let accessToken: String
    let refreshToken: String
    let user: User
    let expiresIn: Int?
    
    enum CodingKeys: String, CodingKey {
        case accessToken
        case refreshToken
        case user
        case expiresIn
    }
}

struct TokenRefreshResponse: Codable {
    let accessToken: String
    let expiresIn: Int?
}

struct LoginRequest: Codable {
    let email: String
    let password: String
}

struct RegisterRequest: Codable {
    let email: String
    let password: String
    let name: String
}

struct ForgotPasswordRequest: Codable {
    let email: String
}
