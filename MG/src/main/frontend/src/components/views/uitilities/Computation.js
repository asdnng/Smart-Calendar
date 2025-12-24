export const toMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export const computeColumns = (tasks) => {
  const columns = [];
  let currentGroup = [];
  const groups = [];

  const result = tasks.map(task => {
    const start = toMinutes(task.startTime);
    const end = toMinutes(task.endTime);

    let column = columns.findIndex(col => col <= start);
    if (column === -1) {
      column = columns.length;
      columns.push(end);
    } else columns[column] = end;

    const enrichedTask = { ...task, start, end, column };

    if (currentGroup.length === 0 || start < Math.max(...currentGroup.map(t => t.end))) {
      currentGroup.push(enrichedTask);
    } else {
      groups.push(currentGroup);
      currentGroup = [enrichedTask];
    }

    return enrichedTask;
  });

  if (currentGroup.length) groups.push(currentGroup);

  groups.forEach(group => {
    const maxCols = Math.max(...group.map(t => t.column)) + 1;
    group.forEach(task => {
      task.totalCols = maxCols;
    });
  });

  return result;
}