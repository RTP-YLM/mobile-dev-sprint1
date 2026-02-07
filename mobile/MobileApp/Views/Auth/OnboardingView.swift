import SwiftUI

struct OnboardingView: View {
    @State private var currentPage: Int = 0
    @Binding var hasCompletedOnboarding: Bool
    
    private let pages: [OnboardingPage] = [
        OnboardingPage(
            image: "book.fill",
            title: "Welcome to StudyZen",
            description: "Your AI-powered study companion. Upload documents, create flashcards, and quiz yourself to learn faster."
        ),
        OnboardingPage(
            image: "doc.text.fill",
            title: "Smart Document Analysis",
            description: "Upload your study materials and let AI extract key concepts, summaries, and insights automatically."
        ),
        OnboardingPage(
            image: "bolt.fill",
            title: "Learn Effectively",
            description: "Generate flashcards and take quizzes generated from your documents. Track your progress and build streaks."
        )
    ]
    
    var body: some View {
        VStack(spacing: 0) {
            // Skip button
            HStack {
                Spacer()
                Button("Skip") {
                    withAnimation {
                        hasCompletedOnboarding = true
                    }
                }
                .font(.subheadline)
                .foregroundColor(.gray)
                .padding()
            }
            
            // Page content
            TabView(selection: $currentPage) {
                ForEach(0..<pages.count, id: \.self) { index in
                    OnboardingPageView(page: pages[index])
                        .tag(index)
                }
            }
            .tabViewStyle(PageTabViewStyle(indexDisplayMode: .never))
            
            // Page indicators
            HStack(spacing: 8) {
                ForEach(0..<pages.count, id: \.self) { index in
                    RoundedRectangle(cornerRadius: 2)
                        .fill(currentPage == index ? Color.blue : Color.gray.opacity(0.3))
                        .frame(width: currentPage == index ? 24 : 8, height: 4)
                        .animation(.easeInOut(duration: 0.2), value: currentPage)
                }
            }
            .padding(.vertical, 24)
            
            // Navigation buttons
            VStack(spacing: 12) {
                PrimaryButton(
                    title: currentPage == pages.count - 1 ? "Get Started" : "Next",
                    action: {
                        if currentPage == pages.count - 1 {
                            withAnimation {
                                hasCompletedOnboarding = true
                            }
                        } else {
                            withAnimation {
                                currentPage += 1
                            }
                        }
                    }
                )
                
                if currentPage < pages.count - 1 {
                    SecondaryButton(title: "Back") {
                        withAnimation {
                            currentPage -= 1
                        }
                    }
                    .opacity(currentPage > 0 ? 1 : 0)
                }
            }
            .padding(.horizontal, 24)
            .padding(.bottom, 32)
        }
        .background(Color(.systemBackground))
    }
}

struct OnboardingPage {
    let image: String
    let title: String
    let description: String
}

struct OnboardingPageView: View {
    let page: OnboardingPage
    
    var body: some View {
        VStack(spacing: 32) {
            Spacer()
            
            // Icon
            ZStack {
                Circle()
                    .fill(Color.blue.opacity(0.1))
                    .frame(width: 140, height: 140)
                
                Image(systemName: page.image)
                    .font(.system(size: 60))
                    .foregroundColor(.blue)
            }
            
            // Text content
            VStack(spacing: 16) {
                Text(page.title)
                    .font(.title2)
                    .fontWeight(.bold)
                    .multilineTextAlignment(.center)
                
                Text(page.description)
                    .font(.body)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .lineSpacing(4)
                    .padding(.horizontal, 32)
            }
            
            Spacer()
            Spacer()
        }
    }
}

#Preview {
    OnboardingView(hasCompletedOnboarding: .constant(false))
}
