package com.neuronest.admin.dto;

public class AdminOverviewDto {
    private long totalUsers;
    private long totalMinors;
    private long totalGamesPlayed;
    private long totalRoutinesCreated;
    private long totalAiInteractions;
    private String databaseStatus;
    private String systemHealth;

    public AdminOverviewDto() {}

    public AdminOverviewDto(
            long totalUsers,
            long totalMinors,
            long totalGamesPlayed,
            long totalRoutinesCreated,
            long totalAiInteractions,
            String databaseStatus,
            String systemHealth
    ) {
        this.totalUsers = totalUsers;
        this.totalMinors = totalMinors;
        this.totalGamesPlayed = totalGamesPlayed;
        this.totalRoutinesCreated = totalRoutinesCreated;
        this.totalAiInteractions = totalAiInteractions;
        this.databaseStatus = databaseStatus;
        this.systemHealth = systemHealth;
    }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
    public long getTotalMinors() { return totalMinors; }
    public void setTotalMinors(long totalMinors) { this.totalMinors = totalMinors; }
    public long getTotalGamesPlayed() { return totalGamesPlayed; }
    public void setTotalGamesPlayed(long totalGamesPlayed) { this.totalGamesPlayed = totalGamesPlayed; }
    public long getTotalRoutinesCreated() { return totalRoutinesCreated; }
    public void setTotalRoutinesCreated(long totalRoutinesCreated) { this.totalRoutinesCreated = totalRoutinesCreated; }
    public long getTotalAiInteractions() { return totalAiInteractions; }
    public void setTotalAiInteractions(long totalAiInteractions) { this.totalAiInteractions = totalAiInteractions; }
    public String getDatabaseStatus() { return databaseStatus; }
    public void setDatabaseStatus(String databaseStatus) { this.databaseStatus = databaseStatus; }
    public String getSystemHealth() { return systemHealth; }
    public void setSystemHealth(String systemHealth) { this.systemHealth = systemHealth; }
}
