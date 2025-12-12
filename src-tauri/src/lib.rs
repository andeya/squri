// Squri - Tauri Main Library

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // Register plugins
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_notification::init())
        // Register commands
        .invoke_handler(tauri::generate_handler![greet, get_app_info])
        .setup(|app| {
            // Setup logging for debug builds
            #[cfg(debug_assertions)]
            {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            #[cfg(desktop)]
            {
                use tauri::menu::{
                    MenuBuilder, MenuItemBuilder, PredefinedMenuItem, SubmenuBuilder,
                };

                // Create File submenu
                let file_menu = SubmenuBuilder::new(app, "File")
                    .items(&[
                        &MenuItemBuilder::with_id("new", "New")
                            .accelerator("CmdOrCtrl+N")
                            .build(app)?,
                        &MenuItemBuilder::with_id("open", "Open")
                            .accelerator("CmdOrCtrl+O")
                            .build(app)?,
                        &PredefinedMenuItem::separator(app)?,
                        &MenuItemBuilder::with_id("save", "Save")
                            .accelerator("CmdOrCtrl+S")
                            .build(app)?,
                        &PredefinedMenuItem::separator(app)?,
                        &MenuItemBuilder::with_id("quit", "Quit")
                            .accelerator("CmdOrCtrl+Q")
                            .build(app)?,
                    ])
                    .build()?;

                // Create Edit submenu
                let edit_menu = SubmenuBuilder::new(app, "Edit")
                    .items(&[
                        &PredefinedMenuItem::undo(app, None)?,
                        &PredefinedMenuItem::redo(app, None)?,
                        &PredefinedMenuItem::separator(app)?,
                        &PredefinedMenuItem::cut(app, None)?,
                        &PredefinedMenuItem::copy(app, None)?,
                        &PredefinedMenuItem::paste(app, None)?,
                        &PredefinedMenuItem::select_all(app, None)?,
                    ])
                    .build()?;

                // Create View submenu
                let view_menu = SubmenuBuilder::new(app, "View")
                    .items(&[
                        &MenuItemBuilder::with_id("home", "Home")
                            .accelerator("CmdOrCtrl+1")
                            .build(app)?,
                        &MenuItemBuilder::with_id("about", "About")
                            .accelerator("CmdOrCtrl+2")
                            .build(app)?,
                        &MenuItemBuilder::with_id("settings", "Settings")
                            .accelerator("CmdOrCtrl+,")
                            .build(app)?,
                        &MenuItemBuilder::with_id("profile", "Profile")
                            .accelerator("CmdOrCtrl+P")
                            .build(app)?,
                        &PredefinedMenuItem::separator(app)?,
                        &MenuItemBuilder::with_id("toggle_theme", "Toggle Theme")
                            .accelerator("CmdOrCtrl+T")
                            .build(app)?,
                        &PredefinedMenuItem::separator(app)?,
                        &MenuItemBuilder::with_id("reload", "Reload")
                            .accelerator("CmdOrCtrl+R")
                            .build(app)?,
                        &MenuItemBuilder::with_id("toggle_devtools", "Toggle DevTools")
                            .accelerator("F12")
                            .build(app)?,
                    ])
                    .build()?;

                // Create Help submenu
                let help_menu = SubmenuBuilder::new(app, "Help")
                    .items(&[
                        &MenuItemBuilder::with_id("about_app", "About Squri").build(app)?,
                        &MenuItemBuilder::with_id("documentation", "Documentation").build(app)?,
                    ])
                    .build()?;

                // Build main menu
                let menu = MenuBuilder::new(app)
                    .items(&[&file_menu, &edit_menu, &view_menu, &help_menu])
                    .build()?;

                // Set menu to app
                app.set_menu(menu)?;

                // Handle menu events
                app.on_menu_event({
                    let app_handle = app.handle().clone();
                    move |_app, event| {
                        use tauri::{Emitter, Manager};
                        let event_id = event.id().0.as_str();

                        match event_id {
                            "quit" => {
                                app_handle.exit(0);
                            }
                            "new" => {
                                let _ = app_handle.emit("menu-new", ());
                            }
                            "open" => {
                                let _ = app_handle.emit("menu-open", ());
                            }
                            "save" => {
                                let _ = app_handle.emit("menu-save", ());
                            }
                            "home" => {
                                let _ = app_handle.emit("menu-navigate", "home");
                            }
                            "about" => {
                                let _ = app_handle.emit("menu-navigate", "about");
                            }
                            "settings" => {
                                let _ = app_handle.emit("menu-navigate", "settings");
                            }
                            "profile" => {
                                let _ = app_handle.emit("menu-navigate", "profile");
                            }
                            "toggle_theme" => {
                                let _ = app_handle.emit("menu-toggle-theme", ());
                            }
                            "reload" => {
                                if let Some(window) = app_handle.get_webview_window("main") {
                                    let _ = window.reload();
                                }
                            }
                            "toggle_devtools" => {
                                let _ = app_handle.emit("menu-toggle-devtools", ());
                            }
                            "about_app" => {
                                let _ = app_handle.emit("menu-about-app", ());
                            }
                            "documentation" => {
                                let _ = app_handle.emit("menu-documentation", ());
                            }
                            _ => {}
                        }
                    }
                });
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Command: Greet
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to Squri!", name)
}

// Command: Get app info
#[tauri::command]
fn get_app_info() -> serde_json::Value {
    serde_json::json!({
        "name": "Squri",
        "version": "0.1.0",
        "description": "A unified codebase framework for desktop and mobile apps"
    })
}
