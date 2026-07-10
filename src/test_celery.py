from src.tasks import test_task

result = test_task.delay()

print("Task ID:", result.id)
print("Task sent successfully!")