#!/bin/bash

echo "🎮 Sudoku Game Launcher"
echo "====================="
echo ""
echo "Choose which version to play:"
echo ""
echo "1) Simple Sudoku (Easy to Expert difficulty)"
echo "2) Advanced Expert Generator (Diabolical puzzles)"
echo "3) Exit"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "Opening Simple Sudoku..."
        open /Users/dmitry/IdeaProjects/sudoku/sudoku-standalone.html
        ;;
    2)
        echo "Opening Expert Sudoku Generator..."
        open /Users/dmitry/IdeaProjects/sudoku/sudoku-expert-demo.html
        ;;
    3)
        echo "Goodbye!"
        exit 0
        ;;
    *)
        echo "Invalid choice. Please run the script again."
        ;;
esac