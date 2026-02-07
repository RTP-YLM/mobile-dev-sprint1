import SwiftUI

struct PrimaryButton: View {
    let title: String
    let action: () -> Void
    var isLoading: Bool = false
    var isDisabled: Bool = false
    var style: ButtonStyle = .primary
    
    enum ButtonStyle {
        case primary
        case secondary
        case destructive
        
        var backgroundColor: Color {
            switch self {
            case .primary:
                return .blue
            case .secondary:
                return .clear
            case .destructive:
                return .red
            }
        }
        
        var foregroundColor: Color {
            switch self {
            case .primary, .destructive:
                return .white
            case .secondary:
                return .blue
            }
        }
        
        var borderColor: Color {
            switch self {
            case .secondary:
                return .blue
            default:
                return .clear
            }
        }
    }
    
    var body: some View {
        Button(action: action) {
            ZStack {
                RoundedRectangle(cornerRadius: 12)
                    .fill(style.backgroundColor)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(style.borderColor, lineWidth: style == .secondary ? 2 : 0)
                    )
                
                if isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: style.foregroundColor))
                } else {
                    Text(title)
                        .font(.headline)
                        .fontWeight(.semibold)
                        .foregroundColor(style.foregroundColor)
                }
            }
            .frame(height: 52)
        }
        .disabled(isDisabled || isLoading)
        .opacity(isDisabled ? 0.6 : 1.0)
    }
}

struct SecondaryButton: View {
    let title: String
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.subheadline)
                .fontWeight(.medium)
                .foregroundColor(.blue)
        }
    }
}

#Preview {
    VStack(spacing: 16) {
        PrimaryButton(title: "Sign In", action: {})
        PrimaryButton(title: "Loading...", action: {}, isLoading: true)
        PrimaryButton(title: "Disabled", action: {}, isDisabled: true)
        PrimaryButton(title: "Secondary", action: {}, style: .secondary)
        PrimaryButton(title: "Delete", action: {}, style: .destructive)
        SecondaryButton(title: "Forgot password?", action: {})
    }
    .padding()
}
