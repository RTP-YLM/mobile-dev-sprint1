// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "MobileApp",
    platforms: [
        .iOS(.v16)
    ],
    products: [
        .library(
            name: "MobileApp",
            targets: ["MobileApp"]),
    ],
    targets: [
        .target(
            name: "MobileApp",
            path: "MobileApp",
            exclude: ["Info.plist", "Assets.xcassets"]
        ),
        .testTarget(
            name: "MobileAppTests",
            dependencies: ["MobileApp"],
            path: "MobileAppTests"
        ),
    ]
)
