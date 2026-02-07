import Foundation
import Combine

enum HTTPMethod: String {
    case get = "GET"
    case post = "POST"
    case put = "PUT"
    case patch = "PATCH"
    case delete = "DELETE"
}

protocol NetworkManagerProtocol {
    func request<T: Decodable>(_ endpoint: Endpoint, type: T.Type) async throws -> T
    func request(_ endpoint: Endpoint) async throws
}

protocol Endpoint {
    var baseURL: String { get }
    var path: String { get }
    var method: HTTPMethod { get }
    var headers: [String: String]? { get }
    var body: Data? { get }
}

extension Endpoint {
    var baseURL: String {
        return "http://localhost:3000/api"
    }
}

class NetworkManager: NetworkManagerProtocol {
    static let shared = NetworkManager()
    
    private let session: URLSession
    private let decoder: JSONDecoder
    
    init(session: URLSession = .shared) {
        self.session = session
        
        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        decoder.dateDecodingStrategy = .iso8601
        self.decoder = decoder
    }
    
    func request<T: Decodable>(_ endpoint: Endpoint, type: T.Type) async throws -> T {
        let request = try buildRequest(from: endpoint)
        
        do {
            let (data, response) = try await session.data(for: request)
            return try handleResponse(data: data, response: response, type: type)
        } catch let error as APIError {
            throw error
        } catch {
            throw APIError.networkError(error)
        }
    }
    
    func request(_ endpoint: Endpoint) async throws {
        let request = try buildRequest(from: endpoint)
        
        do {
            let (data, response) = try await session.data(for: request)
            _ = try handleResponse(data: data, response: response, type: EmptyResponse.self)
        } catch let error as APIError {
            throw error
        } catch {
            throw APIError.networkError(error)
        }
    }
    
    private func buildRequest(from endpoint: Endpoint) throws -> URLRequest {
        guard let url = URL(string: endpoint.baseURL + endpoint.path) else {
            throw APIError.invalidURL
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = endpoint.method.rawValue
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        // Add auth token if available
        if let token = KeychainHelper.shared.getAccessToken() {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        // Add custom headers
        endpoint.headers?.forEach { key, value in
            request.setValue(value, forHTTPHeaderField: key)
        }
        
        request.httpBody = endpoint.body
        
        return request
    }
    
    private func handleResponse<T: Decodable>(data: Data, response: URLResponse, type: T.Type) throws -> T {
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }
        
        let statusCode = httpResponse.statusCode
        
        switch statusCode {
        case 200...299:
            if T.self == EmptyResponse.self {
                return EmptyResponse() as! T
            }
            do {
                return try decoder.decode(T.self, from: data)
            } catch {
                print("Decoding error: \(error)")
                throw APIError.decodingError
            }
            
        case 400:
            let message = try? decodeErrorMessage(from: data)
            throw APIError.badRequest(message)
            
        case 401:
            throw APIError.unauthorized
            
        case 403:
            throw APIError.forbidden
            
        case 404:
            throw APIError.notFound
            
        case 500...599:
            let message = try? decodeErrorMessage(from: data)
            throw APIError.serverError(statusCode, message)
            
        default:
            throw APIError.unknown
        }
    }
    
    private func decodeErrorMessage(from data: Data) -> String? {
        if let errorResponse = try? JSONDecoder().decode(APIErrorResponse.self, from: data) {
            return errorResponse.message
        }
        return nil
    }
}

struct EmptyResponse: Decodable {}

// MARK: - Auth Endpoints

enum AuthEndpoint: Endpoint {
    case login(email: String, password: String)
    case register(email: String, password: String, name: String)
    case refresh(token: String)
    case forgotPassword(email: String)
    case logout
    
    var path: String {
        switch self {
        case .login:
            return "/auth/login"
        case .register:
            return "/auth/register"
        case .refresh:
            return "/auth/refresh"
        case .forgotPassword:
            return "/auth/forgot-password"
        case .logout:
            return "/auth/logout"
        }
    }
    
    var method: HTTPMethod {
        switch self {
        case .login, .register, .refresh, .forgotPassword:
            return .post
        case .logout:
            return .post
        }
    }
    
    var headers: [String: String]? {
        return nil
    }
    
    var body: Data? {
        switch self {
        case .login(let email, let password):
            let body = LoginRequest(email: email, password: password)
            return try? JSONEncoder().encode(body)
            
        case .register(let email, let password, let name):
            let body = RegisterRequest(email: email, password: password, name: name)
            return try? JSONEncoder().encode(body)
            
        case .refresh(let token):
            let body = ["refreshToken": token]
            return try? JSONEncoder().encode(body)
            
        case .forgotPassword(let email):
            let body = ForgotPasswordRequest(email: email)
            return try? JSONEncoder().encode(body)
            
        case .logout:
            return nil
        }
    }
}

enum UserEndpoint: Endpoint {
    case getMe
    
    var path: String {
        switch self {
        case .getMe:
            return "/users/me"
        }
    }
    
    var method: HTTPMethod {
        switch self {
        case .getMe:
            return .get
        }
    }
    
    var headers: [String: String]? {
        return nil
    }
    
    var body: Data? {
        return nil
    }
}
