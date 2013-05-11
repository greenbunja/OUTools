$("#editMemos").submit(saveMemo);
$("#editBlocked").submit(saveBlocked);
$("#editOptions").submit(saveOptions)
showOptions();
showUsermemosTable();
showBlockedUsersTable();
ShowSavedTextsTable();
$("#addBlockedUser").click(addBlockedUser);