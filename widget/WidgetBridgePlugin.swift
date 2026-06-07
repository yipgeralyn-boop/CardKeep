import Foundation
import Capacitor

// Add this file to your Xcode project under App/App/
// It writes the next-due card to the shared App Group so the widget can read it.

@objc(WidgetBridgePlugin)
public class WidgetBridgePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "WidgetBridgePlugin"
    public let jsName = "WidgetBridge"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "setWidgetData", returnType: CAPPluginReturnPromise)
    ]

    let suiteName = "group.com.yipgeralyn.cardkeep"

    @objc func setWidgetData(_ call: CAPPluginCall) {
        guard let json = call.getString("json") else {
            call.reject("Missing json parameter")
            return
        }
        let defaults = UserDefaults(suiteName: suiteName)
        defaults?.set(json, forKey: "cardkeep_widget")
        defaults?.synchronize()

        // Tell WidgetKit to reload
        if #available(iOS 14.0, *) {
            WidgetCenter.shared.reloadAllTimelines()
        }
        call.resolve()
    }
}
