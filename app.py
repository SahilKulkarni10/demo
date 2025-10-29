def solve():
    t = int(input().strip())   # fixed: removed input(1)
    for _ in range(t):
        s = input().strip()
        # Reverse the string
        reversed_s = s[::-1]
        # Transform characters
        transformed = []
        for ch in reversed_s:
            if ch == 'p':
                transformed.append('q')
            elif ch == 'q':
                transformed.append('p')
            elif ch == 'w':
                transformed.append('w')
            else:
                transformed.append(ch)  # keep unchanged if not p/q/w
        print("".join(transformed))

# Call the solve function when the script is run
if __name__ == "__main__":
    solve()
