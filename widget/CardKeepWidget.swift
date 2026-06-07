import WidgetKit
import SwiftUI

// Matches the JSON structure written by the Capacitor bridge
struct WidgetCard: Codable {
    var name: String
    var balance: Double
    var dueTimestamp: Double   // ms since epoch
    var isPaid: Bool
}

struct CardEntry: TimelineEntry {
    let date: Date
    let card: WidgetCard?
}

// Reads card data written by the main app via App Group shared storage
struct CardKeepProvider: TimelineProvider {
    let suiteName = "group.com.yipgeralyn.cardkeep"

    func placeholder(in context: Context) -> CardEntry {
        CardEntry(date: Date(), card: WidgetCard(name: "Visa Platinum", balance: 1234.56, dueTimestamp: Date().addingTimeInterval(86400 * 5).timeIntervalSince1970 * 1000, isPaid: false))
    }

    func getSnapshot(in context: Context, completion: @escaping (CardEntry) -> Void) {
        completion(loadEntry())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<CardEntry>) -> Void) {
        let entry = loadEntry()
        // Refresh every hour
        let next = Calendar.current.date(byAdding: .hour, value: 1, to: Date())!
        completion(Timeline(entries: [entry], policy: .after(next)))
    }

    private func loadEntry() -> CardEntry {
        guard
            let defaults = UserDefaults(suiteName: suiteName),
            let json = defaults.string(forKey: "cardkeep_widget"),
            let data = json.data(using: .utf8),
            let card = try? JSONDecoder().decode(WidgetCard.self, from: data)
        else {
            return CardEntry(date: Date(), card: nil)
        }
        return CardEntry(date: Date(), card: card)
    }
}

// MARK: - Widget Views

struct CardKeepWidgetEntryView: View {
    var entry: CardEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
        if let card = entry.card {
            ZStack {
                LinearGradient(
                    colors: [Color(hex: "1C1640"), Color(hex: "2D1B69")],
                    startPoint: .topLeading, endPoint: .bottomTrailing
                )
                VStack(alignment: .leading, spacing: 6) {
                    HStack {
                        Text("CardKeep")
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundColor(.white.opacity(0.45))
                        Spacer()
                        if card.isPaid {
                            Label("Paid", systemImage: "checkmark.circle.fill")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(Color(hex: "2E9E6B"))
                        }
                    }

                    Spacer()

                    Text(card.name)
                        .font(.system(size: family == .systemSmall ? 13 : 15, weight: .semibold))
                        .foregroundColor(.white.opacity(0.75))
                        .lineLimit(1)

                    Text(formatMoney(card.balance))
                        .font(.system(size: family == .systemSmall ? 26 : 32, weight: .bold, design: .rounded))
                        .foregroundColor(.white)

                    HStack(spacing: 4) {
                        Image(systemName: "calendar")
                            .font(.system(size: 11))
                            .foregroundColor(dueColor(card))
                        Text(dueText(card))
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(dueColor(card))
                    }
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(dueColor(card).opacity(0.18))
                    .cornerRadius(8)
                }
                .padding(16)
            }
        } else {
            ZStack {
                LinearGradient(
                    colors: [Color(hex: "1C1640"), Color(hex: "2D1B69")],
                    startPoint: .topLeading, endPoint: .bottomTrailing
                )
                VStack(spacing: 8) {
                    Image(systemName: "creditcard.fill")
                        .foregroundColor(.white.opacity(0.3))
                        .font(.system(size: 28))
                    Text("Open CardKeep\nto see your cards")
                        .font(.system(size: 12))
                        .foregroundColor(.white.opacity(0.45))
                        .multilineTextAlignment(.center)
                }
            }
        }
    }

    func formatMoney(_ amount: Double) -> String {
        let f = NumberFormatter()
        f.numberStyle = .currency
        f.currencySymbol = "$"
        f.maximumFractionDigits = amount.truncatingRemainder(dividingBy: 1) == 0 ? 0 : 2
        return f.string(from: NSNumber(value: amount)) ?? "$\(amount)"
    }

    func daysUntil(_ card: WidgetCard) -> Int {
        let dueDate = Date(timeIntervalSince1970: card.dueTimestamp / 1000)
        return Calendar.current.dateComponents([.day], from: Calendar.current.startOfDay(for: Date()), to: Calendar.current.startOfDay(for: dueDate)).day ?? 0
    }

    func dueText(_ card: WidgetCard) -> String {
        if card.isPaid { return "Paid" }
        let d = daysUntil(card)
        if d < 0  { return "\(abs(d))d overdue" }
        if d == 0 { return "Due today" }
        if d == 1 { return "Due tomorrow" }
        return "Due in \(d) days"
    }

    func dueColor(_ card: WidgetCard) -> Color {
        if card.isPaid { return Color(hex: "2E9E6B") }
        let d = daysUntil(card)
        if d < 0  { return Color(hex: "E8503A") }
        if d <= 3 { return Color(hex: "E8A93D") }
        return Color(hex: "7B6FFF")
    }
}

@main
struct CardKeepWidget: Widget {
    let kind = "CardKeepWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: CardKeepProvider()) { entry in
            CardKeepWidgetEntryView(entry: entry)
                .containerBackground(Color(hex: "1C1640"), for: .widget)
        }
        .configurationDisplayName("CardKeep")
        .description("See your next card payment at a glance.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

extension Color {
    init(hex: String) {
        let v = UInt64(hex.trimmingCharacters(in: .alphanumerics.inverted), radix: 16) ?? 0
        let r = Double((v >> 16) & 0xFF) / 255
        let g = Double((v >> 8) & 0xFF) / 255
        let b = Double(v & 0xFF) / 255
        self.init(red: r, green: g, blue: b)
    }
}
