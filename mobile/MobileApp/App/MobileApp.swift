import SwiftUI

@main
struct MobileApp: App {
    @AppStorage("hasCompletedOnboarding") private var hasCompletedOnboarding: Bool = false
    @State private var isCheckingAuth: Bool = true
    @State private var isAuthenticated: Bool = false
    
    var body: some Scene {
        WindowGroup {
            Group {
                if isCheckingAuth {
                    // Splash/Loading screen
                    SplashView()
                } else if !hasCompletedOnboarding {
                    OnboardingView(hasCompletedOnboarding: $hasCompletedOnboarding)
                } else if isAuthenticated {
                    ProfileView()
                } else {
                    LoginView()
                }
            }
            .task {
                await checkAuthentication()
            }
        }
    }
    
    private func checkAuthentication() async {
        // Small delay to show splash screen
        try? await Task.sleep(nanoseconds: 1_000_000_000) // 1 second
        
        // Check if user is already authenticated
        let authService = AuthService.shared
        if authService.isAuthenticated {
            // Try to auto-login (refresh token if needed)
            let success = try? await authService.autoLogin()
            isAuthenticated = success == true
        } else {
            isAuthenticated = false
        }
        
        isCheckingAuth = false
    }
}

struct SplashView: View {
    var body: some View {
        ZStack {
            Color.blue.ignoresSafeArea()
            
            VStack(spacing: 16) {
                Image(systemName: "book.fill")
                    .font(.system(size: 80))
                    .foregroundColor(.white)
                
                Text("StudyZen")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle(tint: .white))
                    .scaleEffect(1.2)
                    .padding(.top, 20)
            }
        }
    }
}

#Preview {
    SplashView()
}
