from app.main import bp

@bp.get("/api/deployments")
def deployments_get():
  print("Deployments Get")
  pass

@bp.post("/api/deployments")
def deployments_post():
  print("deployments post")
  pass


