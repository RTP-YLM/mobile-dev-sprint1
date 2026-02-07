import SwiftUI

struct ProfileView: View {
    @StateObject private var viewModel = ProfileViewModel()
    @State private var showLogoutConfirmation: Bool = false
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Profile header
                    VStack(spacing: 16) {
                        // Avatar
                        ZStack {
                            Circle()
                                .fill(Color.blue.gradient)
                                .frame(width: 100, height: 100)
                            
                            Text(viewModel.userInitials)
                                .font(.system(size: 36, weight: .bold))
                                .foregroundColor(.white)
                        }
                        
                        // Name and email
                        VStack(spacing: 4) {
                            Text(viewModel.user?.name ?? "User")
                                .font(.title2)
                                .fontWeight(.bold)
                            
                            Text(viewModel.user?.email ?? "")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                        }
                    }
                    .padding(.top, 20)
                    
                    // Stats section
                    if let stats = viewModel.userProfile?.stats {
                        VStack(alignment: .leading, spacing: 16) {
                            Text("Your Progress")
                                .font(.headline)
                                .padding(.horizontal)
                            
                            LazyVGrid(columns: [
                                GridItem(.flexible()),
                                GridItem(.flexible())
                            ], spacing: 12) {
                                StatCard(
                                    icon: "doc.text",
                                    value: "\(stats.totalDocuments)",
                                    label: "Documents"
                                )
                                
                                StatCard(
                                    icon: "rectangle.on.rectangle",
                                    value: "\(stats.totalFlashcards)",
                                    label: "Flashcards"
                                )
                                
                                StatCard(
                                    icon: "questionmark.circle",
                                    value: "\(stats.totalQuizzes)",
                                    label: "Quizzes"
                                )
                                
                                StatCard(
                                    icon: "flame.fill",
                                    value: "\(stats.studyStreak)",
                                    label: "Day Streak"
                                )
                            }
                            .padding(.horizontal)
                        }
                    }
                    
                    // Account info
                    VStack(alignment: .leading, spacing: 16) {
                        Text("Account Information")
                            .font(.headline)
                            .padding(.horizontal)
                        
                        VStack(spacing: 0) {
                            InfoRow(label: "Member Since", value: viewModel.formattedJoinDate)
                            
                            Divider()
                                .padding(.leading)
                            
                            InfoRow(label: "User ID", value: String(viewModel.user?.id.prefix(8) ?? "-"))
                        }
                        .background(Color(.systemGray6))
                        .cornerRadius(12)
                        .padding(.horizontal)
                    }
                    
                    // Logout button
                    PrimaryButton(
                        title: "Log Out",
                        action: {
                            showLogoutConfirmation = true
                        },
                        isLoading: viewModel.isLoggingOut,
                        style: .destructive
                    )
                    .padding(.horizontal, 24)
                    .padding(.top, 16)
                }
                .padding(.vertical)
            }
            .navigationTitle("Profile")
            .navigationBarTitleDisplayMode(.large)
            .refreshable {
                await viewModel.loadUserProfile()
            }
            .confirmationDialog("Are you sure you want to log out?", isPresented: $showLogoutConfirmation, titleVisibility: .visible) {
                Button("Log Out", role: .destructive) {
                    Task {
                        await viewModel.logout()
                    }
                }
                Button("Cancel", role: .cancel) {}
            }
            .alert("Error", isPresented: $viewModel.showError) {
                Button("OK", role: .cancel) {}
            } message: {
                Text(viewModel.errorMessage ?? "An error occurred")
            }
            .navigationDestination(isPresented: $viewModel.isLoggedOut) {
                LoginView()
                    .navigationBarBackButtonHidden(true)
            }
        }
        .task {
            await viewModel.loadUserProfile()
        }
    }
}

struct StatCard: View {
    let icon: String
    let value: String
    let label: String
    
    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(.blue)
            
            Text(value)
                .font(.title3)
                .fontWeight(.bold)
            
            Text(label)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 16)
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct InfoRow: View {
    let label: String
    let value: String
    
    var body: some View {
        HStack {
            Text(label)
                .font(.subheadline)
                .foregroundColor(.secondary)
            
            Spacer()
            
            Text(value)
                .font(.subheadline)
                .fontWeight(.medium)
        }
        .padding(.horizontal)
        .padding(.vertical, 12)
    }
}

#Preview {
    ProfileView()
}
