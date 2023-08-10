export function usePassword(): [boolean, () => void] {
  let open = false;

  function handleClick(): void {
    open = !open;
  }

  return [open, handleClick];
}
