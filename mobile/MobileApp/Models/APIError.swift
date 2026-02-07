import Foundation

enum APIError: Error, LocalizedError {
    case invalidURL
    case invalidResponse
    case decodingError
    case networkError(Error)
    case serverError(Int, String?)
    case unauthorized
    case forbidden
    case notFound
    case badRequest(String?)
    case tokenExpired
    case unknown
    
    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        case .invalidResponse:
            return "Invalid server response"
        case .decodingError:
            return "Failed to parse response"
        case .networkError(let error):
            return "Network error: \(error.localizedDescription)"
        case .serverError(let code, let message):
            return message ?? "Server error (\(code))"
        case .unauthorized:
            return "Unauthorized. Please login again."
        case .forbidden:
            return "Access forbidden"
        case .notFound:
            return "Resource not found"
        case .badRequest(let message):
            return message ?? "Bad request"
        case .tokenExpired:
            return "Session expired. Please login again."
        case .unknown:
            return "An unknown error occurred"
        }
    }
}

struct APIErrorResponse: Codable {
    let message: String
    let code: String?
    let details: [String]?
}
