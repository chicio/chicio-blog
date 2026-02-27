#!/usr/bin/env python3
"""
Script per generare file index.mdx per ogni gioco.
Struttura attesa: console_folder/nome_gioco/media/*.jpg (o altre estensioni)
Output: game/nome_gioco/index.mdx
"""

import os
import sys
from pathlib import Path
from datetime import datetime

def get_image_extensions():
    """Ritorna le estensioni di immagine supportate"""
    return {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.heic', '.heif'}

def game_name_to_title(game_name):
    """
    Converte il nome della cartella in title.
    Es: devil-may-cry-4 → Devil May Cry 4
    """
    # Sostituisci i trattini con spazi
    title = game_name.replace('-', ' ')
    # Capitalizza ogni parola (first letter uppercase)
    title = ' '.join(word.capitalize() for word in title.split())
    return title

def find_game_folders(root_path):
    """
    Trova tutte le cartelle gioco (quelle che contengono una sottocartella 'media').
    Ritorna una lista di tuple (game_folder_path, game_name)
    """
    game_folders = []
    
    for item in Path(root_path).iterdir():
        if item.is_dir():
            media_folder = item / "media"
            if media_folder.exists() and media_folder.is_dir():
                game_folders.append((item, item.name))
    
    return game_folders

def get_images_in_folder(media_folder):
    """
    Ritorna una lista ordinata di file immagine nella cartella media.
    """
    image_extensions = get_image_extensions()
    images = []
    
    for file in media_folder.iterdir():
        if file.is_file() and file.suffix.lower() in image_extensions:
            images.append(file)
    
    # Ordina per nome (mantiene la sequenzialità)
    images.sort(key=lambda x: x.name)
    return images

def generate_mdx_content(game_name, console, console_display, images, today_date):
    """
    Genera il contenuto del file index.mdx
    game_name: nome della cartella (es. devil-may-cry-4)
    console: nome console per i percorsi (es. playstation3)
    console_display: nome console per la visualizzazione (es. PlayStation 3)
    """
    # Converte il nome del gioco in title
    title = game_name_to_title(game_name)
    
    # Prepara la lista gallery
    gallery_lines = []
    for image in images:
        image_path = f"/images/videogames/console/{console}/game/{game_name}/media/{image.name}"
        gallery_lines.append(f"        - {image_path}")
    
    gallery_content = "\n".join(gallery_lines)
    
    # Prepara il percorso della cover (sempre la prima immagine)
    cover_path = f"/images/videogames/console/{console}/game/{game_name}/cover.jpg"
    
    # Prepara i tags (sostituisci XXX-console con il nome della console)
    tags = f"[{console}, game, XXX-genre]"
    
    mdx_template = f"""---
title: "{title}"
description: "XXX is a XXX game developed by XXX for the {console_display}"
date: {today_date}
image: {cover_path}
tags: {tags}
authors: [fabrizio_duroni]
metadata:
    releaseYear: "XXX"
    acquiredYear: "XXX"
    developer: "XXX"
    publisher: "XXX"
    console: "{console_display}"
    genre: "XXXX"
    pegiRating: "8"
    region: "PAL"
    gallery:
{gallery_content}
---
"""
    
    return mdx_template

def main():
    if len(sys.argv) < 4:
        print("Uso: python3 generate_game_mdx.py <percorso_console_folder> <nome_console> <console_display>")
        print("\nEsempio:")
        print("  python3 generate_game_mdx.py ~/Games/PlayStation3 playstation3 'PlayStation 3'")
        print("\nLa struttura attesa è:")
        print("  ~/Games/PlayStation3/")
        print("    ├── devil-may-cry-4/")
        print("    │   └── media/")
        print("    │       ├── 1.jpg")
        print("    │       └── 2.jpg")
        print("    └── metal-gear/")
        print("        └── media/")
        print("            ├── 1.jpg")
        print("            └── 2.jpg")
        print("\nOutput creato in: game/")
        sys.exit(1)
    
    console_folder_path = Path(sys.argv[1]).expanduser()
    console_name = sys.argv[2]
    console_display = sys.argv[3]
    
    if not console_folder_path.exists():
        print(f"Errore: il percorso '{console_folder_path}' non esiste")
        sys.exit(1)
    
    if not console_folder_path.is_dir():
        print(f"Errore: '{console_folder_path}' non è una cartella")
        sys.exit(1)
    
    # Crea la cartella output se non esiste
    output_base = Path("game")
    output_base.mkdir(exist_ok=True)
    
    print(f"🎮 Generazione file MDX per console: {console_name}")
    print(f"📁 Lettura giochi da: {console_folder_path}")
    print(f"💾 Output in: {output_base}")
    print()
    
    # Ottieni data odierna nel formato corretto
    today = datetime.now().strftime("%Y-%m-%d")
    
    # Trova tutti i giochi
    game_folders = find_game_folders(console_folder_path)
    
    if not game_folders:
        print("⚠️  Nessuna cartella gioco trovata!")
        sys.exit(0)
    
    print(f"📦 Trovati {len(game_folders)} giochi\n")
    
    created_count = 0
    
    for game_folder, game_name in sorted(game_folders):
        media_folder = game_folder / "media"
        
        # Ottieni le immagini
        images = get_images_in_folder(media_folder)
        
        if not images:
            print(f"⚠️  {game_name}: Nessuna immagine trovata in media/ (saltato)")
            continue
        
        # Crea la cartella output per il gioco
        game_output_folder = output_base / game_name
        game_output_folder.mkdir(exist_ok=True)
        
        # Genera il contenuto MDX
        mdx_content = generate_mdx_content(game_name, console_name, console_display, images, today)
        
        # Scrivi il file content.mdx
        mdx_file_path = game_output_folder / "content.mdx"
        
        try:
            mdx_file_path.write_text(mdx_content, encoding='utf-8')
            print(f"✅ {game_name}")
            print(f"   └─ {len(images)} immagini in gallery")
            print(f"   └─ Creato: {mdx_file_path}")
            created_count += 1
        except Exception as e:
            print(f"❌ {game_name}: Errore nella creazione del file - {e}")
        
        print()
    
    print(f"✅ Processo completato!")
    print(f"   • File MDX creati: {created_count}")
    print(f"   • Cartella output: {output_base.absolute()}")

if __name__ == "__main__":
    main()