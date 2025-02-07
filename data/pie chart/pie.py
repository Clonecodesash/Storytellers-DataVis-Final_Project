import pandas as pd

# Load the data
file_path = "filtered_europe_data.csv"  # Change this to your actual file path
df = pd.read_csv(file_path)


print(df)
# Calculate the average value for each country and disaggregation
average_df = df.groupby(['Country Name', 'Disaggregation'], as_index=False)['Value'].mean()

# Rename the 'Value' column to 'Average Value' for clarity
average_df.rename(columns={'Value': 'Average Labor participation rate from 2017-2023'}, inplace=True)

# Save the result to a new CSV file
average_df.to_csv("average_labor_participation_rate2017-2023.csv", index=False)

# Display the result
print(average_df)