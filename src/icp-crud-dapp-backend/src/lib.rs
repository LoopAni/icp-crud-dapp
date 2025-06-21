use candid::{CandidType, Deserialize};
use std::collections::HashMap;
use ic_cdk::storage;
use std::cell::RefCell;

#[derive(CandidType, Deserialize, Clone)]
struct Note {
    id: u32,
    title: String,
    content: String,
}

type Notes = HashMap<u32, Note>;

thread_local! {
    static NOTES: RefCell<Notes> = RefCell::new(HashMap::new());
}

#[ic_cdk::query]
fn get_notes() -> Vec<Note> {
    NOTES.with(|notes| notes.borrow().values().cloned().collect())
}

#[ic_cdk::update]
fn create_note(title: String, content: String) -> Note {
    let note = Note {
        id: ic_cdk::api::time() as u32,
        title,
        content,
    };
    NOTES.with(|notes| notes.borrow_mut().insert(note.id, note.clone()));
    note
}

#[ic_cdk::update]
fn update_note(id: u32, title: String, content: String) -> Option<Note> {
    NOTES.with(|notes| {
        let mut notes = notes.borrow_mut();
        if notes.contains_key(&id) {
            let note = Note { id, title, content };
            notes.insert(id, note.clone());
            Some(note)
        } else {
            None
        }
    })
}

#[ic_cdk::update]
fn delete_note(id: u32) -> bool {
    NOTES.with(|notes| notes.borrow_mut().remove(&id).is_some())
}
