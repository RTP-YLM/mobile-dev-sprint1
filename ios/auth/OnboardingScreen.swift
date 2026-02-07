import SwiftUI

// MARK: - Onboarding Screen
/// Welcome screen with feature highlights for new users
/// หน้าแรกที่ผู้ใช้เห็นเมื่อเปิดแอพครั้งแรก
struct OnboardingScreen: View {
    @State private var currentPage = 0
    @State private var isOnboardingComplete = false
    
    // Onboarding content data
    let pages: [OnboardingPage] = [
        OnboardingPage(
            image: "iphone.and.arrow.forward",
            title: "Welcome",
            description: "Start your journey with us. Experience the best features designed just for you."
        ),
        OnboardingPage(
            image: "lock.shield.fill",
            title: "Secure & Private",
            description: "Your data is protected with industry-leading security measures."
        ),
        OnboardingPage(
            image: "bolt.fill",
            title: "Fast & Easy",
            description: "Get things done quickly with our intuitive and powerful interface."
        )
    ]
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                Spacer()
                
                // Page content with TabView for swiping
                TabView(selection: $currentPage) {
                    ForEach(0..<pages.count, id: \.self) { index in
                        OnboardingPageView(page: pages[index])
                            .tag(index)
                            .accessibilityElement(children: .combine)
                            .accessibilityLabel("Page \(index + 1) of \(pages.count): \(pages[index].title)")
                    }
                }
                .tabViewStyle(PageTabViewStyle(indexDisplayMode: .never))
                .frame(height: 400)
                
                // Custom page indicator
                HStack(spacing: 8) {
                    ForEach(0..<pages.count, id: \.self) { index in
                        Capsule()
                            .fill(currentPage == index ? Color.blue : Color.gray.opacity(0.3))
                            .frame(width: currentPage == index ? 24 : 8, height: 8)
                            .animation(.spring(), value: currentPage)
                            .accessibilityLabel("Page \(index + 1)")
                            .accessibilityValue(currentPage == index ? "Current page" : "")
                    }
                }
                .padding(.vertical)
                
                Spacer()
                
                // Navigation buttons
                VStack(spacing: 16) {
                    if currentPage < pages.count - 1 {
                        // Next button for intermediate pages
                        PrimaryButton(
                            title: "Next",
                            action: {
                                withAnimation {
                                    currentPage += 1
                                }
                            }
                        )
                        
                        // Skip button
                        Button("Skip") {
                            isOnboardingComplete = true
                        }
                        .font(.subheadline)
                        .foregroundColor(.gray)
                        .accessibilityLabel("Skip onboarding")
                        .accessibilityHint("Go directly to login screen")
                    } else {
                        // Get Started button on last page
                        PrimaryButton(
                            title: "Get Started",
                            action: {
                                isOnboardingComplete = true
                            },
                            backgroundColor: .green
                        )
                        
                        // Hidden navigation link to login
                        NavigationLink(value: "login") {
                            EmptyView()
                        }
                        .opacity(0)
                    }
                }
                .padding(.horizontal)
                .padding(.bottom, 30)
            }
            .background(Color(.systemBackground))
            .navigationDestination(isPresented: $isOnboardingComplete) {
                LoginScreen()
            }
        }
    }
}

// MARK: - Onboarding Page Model
/// Data model for onboarding page content
struct OnboardingPage {
    let image: String
    let title: String
    let description: String
}

// MARK: - Onboarding Page View
/// Individual onboarding page layout
struct OnboardingPageView: View {
    let page: OnboardingPage
    
    var body: some View {
        VStack(spacing: 24) {
            // Feature icon/image
            Image(systemName: page.image)
                .resizable()
                .scaledToFit()
                .frame(width: 120, height: 120)
                .foregroundColor(.blue)
                .padding()
                .background(
                    Circle()
                        .fill(Color.blue.opacity(0.1))
                        .frame(width: 200, height: 200)
                )
                .accessibilityHidden(true)
            
            // Title with Dynamic Type support
            Text(page.title)
                .font(.largeTitle)
                .fontWeight(.bold)
                .multilineTextAlignment(.center)
                .foregroundColor(.primary)
                .dynamicTypeSize(.xLarge ... .accessibility3)
            
            // Description with Dynamic Type support
            Text(page.description)
                .font(.body)
                .multilineTextAlignment(.center)
                .foregroundColor(.secondary)
                .padding(.horizontal, 32)
                .dynamicTypeSize(.large ... .accessibility3)
        }
        .padding()
    }
}

// MARK: - Preview
struct OnboardingScreen_Previews: PreviewProvider {
    static var previews: some View {
        OnboardingScreen()
            .previewDevice("iPhone 14")
        
        OnboardingScreen()
            .previewDevice("iPhone 14")
            .preferredColorScheme(.dark)
        
        // Preview with accessibility sizes
        OnboardingScreen()
            .previewDevice("iPhone 14")
            .environment(\.dynamicTypeSize, .accessibility2)
    }
}
