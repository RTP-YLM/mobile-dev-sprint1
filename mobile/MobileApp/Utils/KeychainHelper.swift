import Foundation
import Security

class KeychainHelper {
    static let shared = KeychainHelper()
    
    private init() {}
    
    private let accessTokenKey = "com.studyzen.accessToken"
    private let refreshTokenKey = "com.studyzen.refreshToken"
    private let userKey = "com.studyzen.user"
    
    // MARK: - Token Management
    
    func saveAccessToken(_ token: String) -> Bool {
        return save(token, forKey: accessTokenKey)
    }
    
    func getAccessToken() -> String? {
        return read(forKey: accessTokenKey)
    }
    
    func deleteAccessToken() -> Bool {
        return delete(forKey: accessTokenKey)
    }
    
    func saveRefreshToken(_ token: String) -> Bool {
        return save(token, forKey: refreshTokenKey)
    }
    
    func getRefreshToken() -> String? {
        return read(forKey: refreshTokenKey)
    }
    
    func deleteRefreshToken() -> Bool {
        return delete(forKey: refreshTokenKey)
    }
    
    func clearAllTokens() {
        _ = deleteAccessToken()
        _ = deleteRefreshToken()
        _ = deleteUser()
    }
    
    // MARK: - User Data
    
    func saveUser(_ user: User) -> Bool {
        do {
            let data = try JSONEncoder().encode(user)
            return saveData(data, forKey: userKey)
        } catch {
            print("Error encoding user: \(error)")
            return false
        }
    }
    
    func getUser() -> User? {
        guard let data = readData(forKey: userKey) else { return nil }
        do {
            return try JSONDecoder().decode(User.self, from: data)
        } catch {
            print("Error decoding user: \(error)")
            return nil
        }
    }
    
    func deleteUser() -> Bool {
        return delete(forKey: userKey)
    }
    
    var isLoggedIn: Bool {
        return getAccessToken() != nil
    }
    
    // MARK: - Private Methods
    
    private func save(_ string: String, forKey key: String) -> Bool {
        guard let data = string.data(using: .utf8) else { return false }
        return saveData(data, forKey: key)
    }
    
    private func saveData(_ data: Data, forKey key: String) -> Bool {
        // Delete existing item first
        _ = delete(forKey: key)
        
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecValueData as String: data,
            kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlock
        ]
        
        let status = SecItemAdd(query as CFDictionary, nil)
        return status == errSecSuccess
    }
    
    private func read(forKey key: String) -> String? {
        guard let data = readData(forKey: key) else { return nil }
        return String(data: data, encoding: .utf8)
    }
    
    private func readData(forKey key: String) -> Data? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        
        guard status == errSecSuccess, let data = result as? Data else {
            return nil
        }
        return data
    }
    
    private func delete(forKey key: String) -> Bool {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key
        ]
        
        let status = SecItemDelete(query as CFDictionary)
        return status == errSecSuccess || status == errSecItemNotFound
    }
}
