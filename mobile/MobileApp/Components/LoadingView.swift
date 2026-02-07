import SwiftUI

struct LoadingView: View {
    var message: String = "Loading..."
    
    var body: some View {
        ZStack {
            Color.black.opacity(0.4)
                .ignoresSafeArea()
            
            VStack(spacing: 16) {
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle(tint: .white))
                    .scaleEffect(1.5)
                
                Text(message)
                    .font(.subheadline)
                    .foregroundColor(.white)
            }
            .padding(24)
            .background(
                RoundedRectangle(cornerRadius: 16)
                    .fill(Color(.systemGray6).opacity(0.9))
            )
        }
    }
}

struct LoadingModifier: ViewModifier {
    var isLoading: Bool
    var message: String = "Loading..."
    
    func body(content: Content) -> some View {
        ZStack {
            content
            
            if isLoading {
                LoadingView(message: message)
            }
        }
    }
}

extension View {
    func loading(_ isLoading: Bool, message: String = "Loading...") -> some View {
        modifier(LoadingModifier(isLoading: isLoading, message: message))
    }
}

struct EmptyStateView: View {
    let icon: String
    let title: String
    let message: String
    var actionTitle: String?
    var action: (() -> Void)?
    
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: icon)
                .font(.system(size: 60))
                .foregroundColor(.gray.opacity(0.6))
            
            Text(title)
                .font(.title3)
                .fontWeight(.semibold)
                .foregroundColor(.primary)
            
            Text(message)
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
            
            if let actionTitle = actionTitle, let action = action {
                Button(action: action) {
                    Text(actionTitle)
                        .font(.subheadline)
                        .fontWeight(.medium)
                        .foregroundColor(.blue)
                }
                .padding(.top, 8)
            }
        }
        .padding(32)
    }
}

#Preview {
    Group {
        LoadingView(message: "Signing in...")
        
        EmptyStateView(
            icon: "doc.text.magnifyingglass",
            title: "No documents",
            message: "Upload your first document to get started with StudyZen",
            actionTitle: "Upload Document",
            action: {}
        )
    }
}
