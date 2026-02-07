import SwiftUI

// MARK: - Custom TextField Component
/// A reusable custom text field with validation support and accessibility features
struct CustomTextField: View {
    let title: String
    let placeholder: String
    @Binding var text: String
    var isSecure: Bool = false
    var keyboardType: UIKeyboardType = .default
    var autocapitalization: TextInputAutocapitalization = .sentences
    var errorMessage: String?
    var onCommit: (() -> Void)?
    
    @State private var isVisible: Bool = false
    
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            // Title label with accessibility
            Text(title)
                .font(.subheadline)
                .fontWeight(.medium)
                .foregroundColor(.primary)
                .accessibilityLabel("\(title) input field")
            
            // TextField container with border
            HStack {
                Group {
                    if isSecure && !isVisible {
                        SecureField(placeholder, text: $text)
                    } else {
                        TextField(placeholder, text: $text)
                    }
                }
                .keyboardType(keyboardType)
                .textInputAutocapitalization(autocapitalization)
                .autocorrectionDisabled(true)
                .submitLabel(.next)
                .onSubmit {
                    onCommit?()
                }
                // Dynamic Type support - ใช้ font size ที่ปรับตามการตั้งค่าของผู้ใช้
                .font(.body)
                
                // Toggle visibility button for password fields
                if isSecure {
                    Button(action: { isVisible.toggle() }) {
                        Image(systemName: isVisible ? "eye.slash.fill" : "eye.fill")
                            .foregroundColor(.gray)
                            .accessibilityLabel(isVisible ? "Hide password" : "Show password")
                    }
                    .accessibilityHint("Double tap to toggle password visibility")
                }
            }
            .padding()
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color(.systemGray6))
            )
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(errorMessage != nil ? Color.red : Color.clear, lineWidth: 1)
            )
            
            // Error message display
            if let error = errorMessage {
                Text(error)
                    .font(.caption)
                    .foregroundColor(.red)
                    .accessibilityLabel("Error: \(error)")
                    .transition(.opacity)
            }
        }
    }
}

// MARK: - Primary Button Component
/// A reusable primary action button with loading state
struct PrimaryButton: View {
    let title: String
    let action: () -> Void
    var isLoading: Bool = false
    var isEnabled: Bool = true
    var backgroundColor: Color = .blue
    
    var body: some View {
        Button(action: action) {
            ZStack {
                // Loading indicator (shown when isLoading is true)
                if isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        .scaleEffect(1.2)
                } else {
                    Text(title)
                        .font(.headline)
                        .fontWeight(.semibold)
                        // Dynamic Type support
                        .dynamicTypeSize(.xSmall ... .accessibility3)
                }
            }
            .frame(maxWidth: .infinity)
            .frame(height: 50)
            .background(isEnabled ? backgroundColor : Color.gray.opacity(0.5))
            .foregroundColor(.white)
            .cornerRadius(12)
        }
        .disabled(!isEnabled || isLoading)
        .accessibilityLabel(title)
        .accessibilityHint(isLoading ? "Loading in progress" : "Double tap to \(title.lowercased())")
        .accessibilityAddTraits(.isButton)
    }
}

// MARK: - Error Banner Component
/// Displays error messages in a banner format
struct ErrorBanner: View {
    let message: String
    var onDismiss: (() -> Void)?
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: "exclamationmark.triangle.fill")
                .foregroundColor(.white)
                .accessibilityHidden(true)
            
            Text(message)
                .font(.subheadline)
                .foregroundColor(.white)
                .multilineTextAlignment(.leading)
            
            Spacer()
            
            if let onDismiss = onDismiss {
                Button(action: onDismiss) {
                    Image(systemName: "xmark")
                        .foregroundColor(.white)
                }
                .accessibilityLabel("Dismiss error message")
            }
        }
        .padding()
        .background(Color.red.opacity(0.9))
        .cornerRadius(12)
        .accessibilityLabel("Error: \(message)")
        .accessibilityHint("Swipe up to dismiss")
    }
}

// MARK: - Validation Extension
/// Form validation utilities
struct Validation {
    /// Validates email format using regex pattern
    static func isValidEmail(_ email: String) -> Bool {
        let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}"
        let emailPredicate = NSPredicate(format: "SELF MATCHES %@", emailRegex)
        return emailPredicate.evaluate(with: email)
    }
    
    /// Validates password strength
    /// - Returns: Tuple containing (isValid: Bool, strength: PasswordStrength, message: String)
    static func validatePassword(_ password: String) -> (isValid: Bool, strength: PasswordStrength, message: String) {
        guard password.count >= 8 else {
            return (false, .weak, "Password must be at least 8 characters")
        }
        
        var score = 0
        if password.rangeOfCharacter(from: .uppercaseLetters) != nil { score += 1 }
        if password.rangeOfCharacter(from: .lowercaseLetters) != nil { score += 1 }
        if password.rangeOfCharacter(from: .decimalDigits) != nil { score += 1 }
        if password.rangeOfCharacter(from: CharacterSet(charactersIn: "!@#$%^&*(),.?\":{}|<>")) != nil { score += 1 }
        
        switch score {
        case 0...1:
            return (false, .weak, "Password is too weak. Add uppercase, numbers, or special characters.")
        case 2:
            return (true, .medium, "Password strength: Medium")
        case 3...4:
            return (true, .strong, "Password strength: Strong")
        default:
            return (false, .weak, "Invalid password")
        }
    }
    
    enum PasswordStrength {
        case weak, medium, strong
        
        var color: Color {
            switch self {
            case .weak: return .red
            case .medium: return .orange
            case .strong: return .green
            }
        }
    }
}

// MARK: - Preview
struct ComponentsPreview: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 20) {
            CustomTextField(
                title: "Email",
                placeholder: "Enter your email",
                text: .constant("test@example.com"),
                keyboardType: .emailAddress,
                autocapitalization: .never
            )
            
            CustomTextField(
                title: "Password",
                placeholder: "Enter your password",
                text: .constant(""),
                isSecure: true,
                errorMessage: "Password is required"
            )
            
            PrimaryButton(title: "Sign In", action: {}, isEnabled: true)
            
            PrimaryButton(title: "Loading...", action: {}, isLoading: true)
            
            ErrorBanner(message: "Invalid credentials. Please try again.")
        }
        .padding()
        .previewLayout(.sizeThatFits)
    }
}
