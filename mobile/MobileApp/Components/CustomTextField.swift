import SwiftUI

struct CustomTextField: View {
    let title: String
    let placeholder: String
    @Binding var text: String
    var isSecure: Bool = false
    var keyboardType: UIKeyboardType = .default
    var autocapitalization: TextInputAutocapitalization = .sentences
    var errorMessage: String?
    
    @State private var isPasswordVisible: Bool = false
    
    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title)
                .font(.subheadline)
                .fontWeight(.medium)
                .foregroundColor(.primary)
            
            ZStack {
                RoundedRectangle(cornerRadius: 10)
                    .fill(Color(.systemGray6))
                
                HStack {
                    if isSecure && !isPasswordVisible {
                        SecureField(placeholder, text: $text)
                            .textInputAutocapitalization(autocapitalization)
                            .autocorrectionDisabled(true)
                    } else {
                        TextField(placeholder, text: $text)
                            .textInputAutocapitalization(autocapitalization)
                            .autocorrectionDisabled(true)
                            .keyboardType(keyboardType)
                    }
                    
                    if isSecure {
                        Button(action: {
                            withAnimation {
                                isPasswordVisible.toggle()
                            }
                        }) {
                            Image(systemName: isPasswordVisible ? "eye.slash.fill" : "eye.fill")
                                .foregroundColor(.gray)
                        }
                    }
                }
                .padding(.horizontal, 12)
            }
            .frame(height: 48)
            
            if let errorMessage = errorMessage {
                Text(errorMessage)
                    .font(.caption)
                    .foregroundColor(.red)
                    .transition(.opacity)
            }
        }
    }
}

#Preview {
    VStack(spacing: 20) {
        CustomTextField(
            title: "Email",
            placeholder: "Enter your email",
            text: .constant(""),
            keyboardType: .emailAddress,
            autocapitalization: .never
        )
        
        CustomTextField(
            title: "Password",
            placeholder: "Enter your password",
            text: .constant(""),
            isSecure: true
        )
        
        CustomTextField(
            title: "Email",
            placeholder: "Enter your email",
            text: .constant("invalid"),
            keyboardType: .emailAddress,
            errorMessage: "Please enter a valid email"
        )
    }
    .padding()
}
