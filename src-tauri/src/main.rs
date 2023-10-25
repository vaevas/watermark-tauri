// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::{Menu, MenuItem, Submenu};
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
  let submenu_main = Submenu::new(
    "ImageTiny".to_string(),
    Menu::new()
      .add_native_item(MenuItem::Minimize)
      .add_native_item(MenuItem::Hide)
      .add_native_item(MenuItem::Separator)
      .add_native_item(MenuItem::CloseWindow)
      .add_native_item(MenuItem::Quit),
  );

  let menu = Menu::new().add_submenu(submenu_main);
    tauri::Builder::default()
        .menu(menu)
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
