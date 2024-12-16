

# D3.js Lollipop Chart Visualization

This project demonstrates a dynamic and interactive lollipop chart visualization using **D3.js v7**. The visualization compares male and female employment rates over time for selected countries.

---

## Features of the Code

The visualization includes the following key functionalities:

- **Data Loading**: Employment rate data for males and females is loaded from two CSV files located in the `dataset/` folder:
  - `males_data.csv`
  - `females_data.csv`
  
- **Dropdown Selection**: A dropdown menu allows users to select a country. The chart dynamically updates to display employment rates for the chosen country.

- **Lollipop Chart**: 
  - Two distinct lines (with circles at the top) are created for male and female employment rates.
  - The x-axis represents the years (1991–2022).
  - The y-axis represents employment rates.
  - Male and female lollipops are offset slightly to avoid overlapping.

- **Dynamic Axes**: The axes automatically adjust based on the selected country’s data.

- **Legend and Labels**:
  - A legend in the upper-right corner explains the chart’s colors.
  - X-axis and Y-axis labels ("Year" and "Employment Rate") are included.

- **Interactivity**:
  - The chart updates in real-time when the user selects a different country.
  - (Optional) Smooth transitions animate changes to the lollipops and axes.

---

## How to Use

1. **Clone the Repository**: 
   ```
   git clone <repository-link>
   ```

2. **Run a Local Server**:
   Use a simple HTTP server (e.g., Python's HTTP Simple Server) to view the project:
   ```bash
   python3 -m http.server
   ```
   Open `index.html` in a browser (tested with Firefox).

3. **Explore the Visualization**:
   - Use the dropdown menu to select a country.
   - Observe how male and female employment rates change over time.

---

## Folder Structure

- `index.html`: Main HTML file containing the structure of the visualization.
- `js/main.js`: JavaScript logic for data loading, processing, and visualization.
- `dataset/`: Folder containing the CSV files for male and female employment data.
- `style.css`: Optional styling for the dropdown and visualization.
- `img/`: Folder containing example images (if needed).

---

## Preview

The visualization looks like this when complete:

![Lollipop Chart Example](img/completed.png)
