#!/usr/bin/env python3
"""
Script per rinominare e spostare sequenzialmente le immagini dei giochi in una cartella media.
Struttura attesa: console_folder/nome_gioco/*.jpg (immagini Apple)
Output: console_folder/nome_gioco/media/*.jpg (rinominate sequenzialmente)
"""

import os
import sys
from pathlib import Path

def get_image_extensions():
    """Ritorna le estensioni di immagine supportate"""
    return {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.heic', '.heif'}

def find_game_folders(root_path):
    """
    Trova tutte le cartelle gioco (cartelle che contengono immagini direttamente).
    Una cartella gioco è quella che:
    - NON è una cartella 'media'
    - Contiene file immagine direttamente (non in sottocartelle)
    Ritorna una lista di Path alle cartelle gioco.
    """
    game_folders = []
    image_extensions = get_image_extensions()
    
    for item in Path(root_path).iterdir():
        if item.is_dir() and item.name != 'media':
            # Controlla se contiene immagini direttamente (non in sottocartelle)
            has_images = any(
                f.suffix.lower() in image_extensions
                for f in item.iterdir() if f.is_file()
            )
            if has_images:
                game_folders.append(item)
    
    return game_folders

def media_folder_exists(game_folder):
    """
    Controlla se la cartella media esiste già.
    Ritorna True se esiste, False altrimenti.
    """
    media_folder = game_folder / "media"
    return media_folder.exists() and media_folder.is_dir()

def get_images_in_folder(game_folder):
    """
    Ritorna una lista ordinata di file immagine nella cartella gioco.
    """
    image_extensions = get_image_extensions()
    images = []
    
    for file in game_folder.iterdir():
        if file.is_file() and file.suffix.lower() in image_extensions:
            images.append(file)
    
    # Ordina per nome (mantiene la sequenzialità, es. IMG_0618, IMG_0619, ecc)
    images.sort(key=lambda x: x.name)
    return images

def process_game_folder(game_folder):
    """
    Rinomina le immagini in modo sequenziale e le sposta in una cartella media.
    Restituisce (numero_spostati, stato).
    stato può essere: "done", "skip", "already"
    """
    # Controlla se media già esiste
    if media_folder_exists(game_folder):
        return 0, "already"
    
    # Ottieni le immagini nella cartella gioco
    images = get_images_in_folder(game_folder)
    
    if not images:
        return 0, "skip"
    
    # Crea la cartella media
    media_folder = game_folder / "media"
    try:
        media_folder.mkdir(exist_ok=True)
    except Exception as e:
        print(f"  ✗ Errore nella creazione della cartella media: {e}")
        return 0, "error"
    
    # Sposta e rinomina le immagini sequenzialmente
    moved_count = 0
    for idx, image_file in enumerate(images, start=1):
        new_name = f"{idx}{image_file.suffix}"
        new_path = media_folder / new_name
        
        # Se il file esiste già nella cartella media, prova ad aggiungere un suffisso
        if new_path.exists():
            base_idx = 1
            while new_path.exists():
                new_name = f"{idx}_{base_idx}{image_file.suffix}"
                new_path = media_folder / new_name
                base_idx += 1
        
        try:
            image_file.rename(new_path)
            print(f"  ✓ {image_file.name} → media/{new_name}")
            moved_count += 1
        except Exception as e:
            print(f"  ✗ Errore nello spostare {image_file.name}: {e}")
    
    return moved_count, "done"

def main():
    if len(sys.argv) < 2:
        print("Uso: python3 rename_game_images.py <percorso_cartella_principale>")
        print("\nEsempio:")
        print("  python3 rename_game_images.py ~/Games/PlayStation3")
        print("\nLa struttura attesa è:")
        print("  ~/Games/PlayStation3/")
        print("    ├── devil-may-cry-4/")
        print("    │   ├── IMG_0618.jpg")
        print("    │   └── IMG_0619.jpg")
        print("    └── metal-gear/")
        print("        ├── IMG_0620.jpg")
        print("        └── IMG_0621.jpg")
        print("\nOutput creato in:")
        print("  ~/Games/PlayStation3/")
        print("    ├── devil-may-cry-4/")
        print("    │   └── media/")
        print("    │       ├── 1.jpg")
        print("    │       └── 2.jpg")
        print("    └── metal-gear/")
        print("        └── media/")
        print("            ├── 1.jpg")
        print("            └── 2.jpg")
        sys.exit(1)
    
    root_path = Path(sys.argv[1]).expanduser()
    
    if not root_path.exists():
        print(f"Errore: il percorso '{root_path}' non esiste")
        sys.exit(1)
    
    if not root_path.is_dir():
        print(f"Errore: '{root_path}' non è una cartella")
        sys.exit(1)
    
    print(f"🔍 Ricerca cartelle gioco in: {root_path}")
    print()
    
    game_folders = find_game_folders(root_path)
    
    if not game_folders:
        print("⚠️  Nessuna cartella gioco trovata!")
        sys.exit(0)
    
    print(f"📁 Trovate {len(game_folders)} cartelle gioco\n")
    
    total_moved = 0
    skipped_folders = 0
    
    for game_folder in sorted(game_folders):
        console_folder = game_folder.parent
        
        print(f"🎮 {console_folder.name}/{game_folder.name}/")
        
        moved, status = process_game_folder(game_folder)
        total_moved += moved
        
        if status == "done":
            print(f"   → Spostati {moved} file in media/ ✅")
        elif status == "already":
            print("   → Cartella media già esiste (saltata) ⏭️")
            skipped_folders += 1
        elif status == "skip":
            print("   → Nessuna immagine trovata ⚠️")
        elif status == "error":
            print("   → Errore nel processamento ❌")
        
        print()
    
    print(f"✅ Processo completato!")
    print(f"   • File spostati: {total_moved}")
    print(f"   • Cartelle già processate (saltate): {skipped_folders}")

if __name__ == "__main__":
    main()