import Foundation

struct User: Codable, Identifiable {
    let id: String
    let email: String
    let name: String
    let createdAt: Date?
    let updatedAt: Date?
    
    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case email
        case name
        case createdAt
        case updatedAt
    }
}

struct UserProfile: Codable {
    let user: User
    let stats: UserStats?
}

struct UserStats: Codable {
    let totalDocuments: Int
    let totalFlashcards: Int
    let totalQuizzes: Int
    let studyStreak: Int
}
