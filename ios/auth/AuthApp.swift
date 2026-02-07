import SwiftUI

// MARK: - Main App Entry Point
/// Root application with authentication flow routing
@main
struct AuthApp: App {
    @AppStorage("hasCompletedOnboarding") private var hasCompletedOnboarding = false
    @AppStorage("isLoggedIn") private var isLoggedIn = false
    
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

// MARK: - Content View
/// Root view that manages navigation between auth states
struct ContentView: View {
    @AppStorage("hasCompletedOnboarding") private var hasCompletedOnboarding = false
    @AppStorage("isLoggedIn") private var isLoggedIn = false
    
    var body: some View {
        Group {
            if isLoggedIn {
                // Main app content after successful login
                MainTabView()
            } else if hasCompletedOnboarding {
                // Skip onboarding if already completed
                LoginScreen()
            } else {
                // Show onboarding for first-time users
                OnboardingScreen()
            }
        }
    }
}

// MARK: - Main Tab View
/// Main app interface shown after successful authentication
struct MainTabView: View {
    var body: some View {
        TabView {
            HomeView()
                .tabItem {
                    Label("Home", systemImage: "house.fill")
                }
            
            ProfileView()
                .tabItem {
                    Label("Profile", systemImage: "person.fill")
                }
        }
    }
}

// MARK: - Home View
struct HomeView: View {
    var body: some View {
        NavigationStack {
            VStack {
                Text("Welcome to the App!")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                
                Text("You are successfully logged in.")
                    .font(.body)
                    .foregroundColor(.secondary)
                    .padding(.top, 8)
            }
            .navigationTitle("Home")
        }
    }
}

// MARK: - Profile View
struct ProfileView: View {
    @AppStorage("isLoggedIn") private var isLoggedIn = false
    @AppStorage("hasCompletedOnboarding") private var hasCompletedOnboarding = false
    
    var body: some View {
        NavigationStack {
            List {
                Section("Account") {
                    HStack {
                        Image(systemName: "person.circle.fill")
                            .resizable()
                            .frame(width: 60, height: 60)
                            .foregroundColor(.blue)
                        
                        VStack(alignment: .leading) {
                            Text("User Name")
                                .font(.headline)
                            Text("user@example.com")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                        }
                    }
                    .padding(.vertical, 8)
                }
                
                Section("Actions") {
                    Button("Sign Out") {
                        signOut()
                    }
                    .foregroundColor(.red)
                    
                    Button("Reset Onboarding") {
                        hasCompletedOnboarding = false
                    }
                    .foregroundColor(.blue)
                }
            }
            .navigationTitle("Profile")
        }
    }
    
    private func signOut() {
        isLoggedIn = false
    }
}

// MARK: - Preview
struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
