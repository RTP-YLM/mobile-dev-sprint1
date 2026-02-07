import Foundation

enum ValidationError: Error, LocalizedError {
    case invalidEmail
    case passwordTooShort
    case passwordsDoNotMatch
    case nameRequired
    case invalidPasswordFormat
    case emptyField(String)
    
    var errorDescription: String? {
        switch self {
        case .invalidEmail:
            return "Please enter a valid email address"
        case .passwordTooShort:
            return "Password must be at least 8 characters"
        case .passwordsDoNotMatch:
            return "Passwords do not match"
        case .nameRequired:
            return "Name is required"
        case .invalidPasswordFormat:
            return "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        case .emptyField(let field):
            return "\(field) is required"
        }
    }
}

struct Validators {
    
    static func validateEmail(_ email: String) -> ValidationError? {
        let trimmed = email.trimmingCharacters(in: .whitespacesAndNewlines)
        
        guard !trimmed.isEmpty else {
            return .emptyField("Email")
        }
        
        let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}"
        let emailPredicate = NSPredicate(format: "SELF MATCHES %@", emailRegex)
        
        guard emailPredicate.evaluate(with: trimmed) else {
            return .invalidEmail
        }
        
        return nil
    }
    
    static func validatePassword(_ password: String, fieldName: String = "Password") -> ValidationError? {
        guard !password.isEmpty else {
            return .emptyField(fieldName)
        }
        
        guard password.count >= 8 else {
            return .passwordTooShort
        }
        
        // Optional: Strong password validation
        // Uncomment if you want strong password requirements
        /*
        let hasUppercase = password.range(of: "[A-Z]", options: .regularExpression) != nil
        let hasLowercase = password.range(of: "[a-z]", options: .regularExpression) != nil
        let hasNumber = password.range(of: "[0-9]", options: .regularExpression) != nil
        
        guard hasUppercase && hasLowercase && hasNumber else {
            return .invalidPasswordFormat
        }
        */
        
        return nil
    }
    
    static func validatePasswordMatch(_ password: String, _ confirmPassword: String) -> ValidationError? {
        guard password == confirmPassword else {
            return .passwordsDoNotMatch
        }
        return nil
    }
    
    static func validateName(_ name: String) -> ValidationError? {
        let trimmed = name.trimmingCharacters(in: .whitespacesAndNewlines)
        
        guard !trimmed.isEmpty else {
            return .nameRequired
        }
        
        return nil
    }
    
    static func validateLogin(email: String, password: String) -> [ValidationError] {
        var errors: [ValidationError] = []
        
        if let emailError = validateEmail(email) {
            errors.append(emailError)
        }
        
        if let passwordError = validatePassword(password) {
            errors.append(passwordError)
        }
        
        return errors
    }
    
    static func validateRegister(email: String, password: String, confirmPassword: String, name: String) -> [ValidationError] {
        var errors: [ValidationError] = []
        
        if let nameError = validateName(name) {
            errors.append(nameError)
        }
        
        if let emailError = validateEmail(email) {
            errors.append(emailError)
        }
        
        if let passwordError = validatePassword(password) {
            errors.append(passwordError)
        }
        
        if let matchError = validatePasswordMatch(password, confirmPassword) {
            errors.append(matchError)
        }
        
        return errors
    }
    
    static func validateForgotPassword(email: String) -> [ValidationError] {
        var errors: [ValidationError] = []
        
        if let emailError = validateEmail(email) {
            errors.append(emailError)
        }
        
        return errors
    }
}
