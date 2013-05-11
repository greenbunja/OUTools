$("#editMemos").submit(saveMemo);
$("#editBlocked").submit(saveBlocked);
$("#editAutosaveInterval").submit(saveAutosaveInterval)
getInterval();
showUsermemosTable();
showBlockedUsersTable();
ShowSavedTextsTable();
$("#addBlockedUser").click(addBlockedUser);