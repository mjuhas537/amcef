export function checkAuthenticated(
  req: { isAuthenticated: () => any },
  res: { redirect: (arg0: string) => void },
  next: () => any
) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/intro");
}
