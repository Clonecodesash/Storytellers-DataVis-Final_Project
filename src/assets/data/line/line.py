import pandas as pd

# Load the data
file_path = "worldbank_data_labor_participating_rate.csv"  # Change this to your actual file path
df = pd.read_csv(file_path)

# List of European countries (adjust as needed)
european_countries = ["France", "Germany", "Italy", "Spain", "United Kingdom", "Netherlands",
                       "Belgium", "Sweden", "Norway", "Denmark", "Finland", "Poland", "Portugal",
                       "Greece", "Austria", "Switzerland", "Ireland", "Hungary", "Czech Republic",
                       "Slovakia", "Slovenia", "Croatia", "Lithuania", "Latvia", "Estonia", "Romania",
                       "Bulgaria", "Serbia", "Iceland", "Luxembourg",
                       "Malta", "Bosnia and Herzegovina", "Albania", "North Macedonia", "Montenegro"]

# Filter only European countries
df_europe = df[df["Country Name"].isin(european_countries)]
print(df_europe)


# filter the years from 2017 to 2023 in the year column for the european countries
df_europe = df_europe[(df_europe["Year"] >= 2017) & (df_europe["Year"] <= 2023)]



# filter the disaggregation column for the european countries for only the total 
valid_disaggregations = ["Basic, total", "Advanced, total","Intermediate, total"]
df_europe = df_europe[df_europe["Disaggregation"].isin(valid_disaggregations)]

print(df_europe)

# Save the filtered data to a new CSV file
output_file = "filtered_europe_data.csv"
df_europe.to_csv(output_file, index=False)


# # Filter for specific disaggregation categories
# valid_disaggregations = ["basic-female", "basic-male", "basic-advanced"]
# df_filtered = df_europe[df_europe["dissaggreagation"].isin(valid_disaggregations)]

# # Save the filtered data to a new Excel file
# output_file = "filtered_europe_data.xlsx"
# df_filtered.to_excel(output_file, index=False)

# print(f"Filtered data saved to {output_file}")
