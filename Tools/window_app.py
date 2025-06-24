import tkinter as tk

# Create the main window
root = tk.Tk()
root.title("Sample Window")
root.geometry("800x600")  # Expanded window size

# Add a label
label = tk.Label(root, text="Animation Creator", font=("Arial", 16))
label.pack(pady=40)

# Add a button to close the window
close_button = tk.Button(root, text="Close", command=root.destroy)
close_button.pack(pady=20)

# Start the GUI event loop
root.mainloop()
