import pandas as pd

# Load the three sheets (replace filenames with actual file names)
total_df = pd.read_excel(r"C:\Users\ASHLEY\Downloads\barchart_total_net_income.xlsx", sheet_name="Sheet 1", skiprows=12)
female_df = pd.read_excel(r"C:\Users\ASHLEY\Downloads\bar_chart_net_income_lvl58_females.xlsx", sheet_name="Sheet 1", header=11, skiprows=12)
male_df = pd.read_excel(r"C:\Users\ASHLEY\Downloads\barchart_net_income_lvl58_males.xlsx", sheet_name="Sheet 1", header=10, skiprows=12)

# Show the dataframes loaded from the excel files
# print(male_df.columns)
# print(male_df)
# print("-------------------------------------------------")
# print(female_df)
# print("-------------------------------------------------")
# print(total_df)

new_columns = ['Country', '2023', '2022', '2021', '2020', '2019', '2018', '2017']

male_df.columns = new_columns
female_df.columns = new_columns
total_df.columns = new_columns



male_df =  male_df.iloc[:26]
female_df = female_df.iloc[:25]
total_df = total_df.iloc[:36]

print(male_df.columns)
print(male_df)
print("-------------------------------------------------")
print(female_df)
print("-------------------------------------------------")
print(total_df)


# Function to reshape the dataframe
def reshape_dataframe(df, type_label):
    df = df.melt(id_vars=["Country"], var_name="Year", value_name="Percentage")
    df["Type"] = type_label
    return df

# Reshape the dataframes
male_long = reshape_dataframe(male_df, "Male")
female_long = reshape_dataframe(female_df, "Female")
total_long = reshape_dataframe(total_df, "Total")

# Concatenate the dataframes
combined_df = pd.concat([male_long, female_long, total_long], ignore_index=True)

# Display the combined dataframe
print(combined_df.head())

# Save the combined dataframe to a CSV file
combined_df.to_csv("combined_median_income_data.csv", index=False)
