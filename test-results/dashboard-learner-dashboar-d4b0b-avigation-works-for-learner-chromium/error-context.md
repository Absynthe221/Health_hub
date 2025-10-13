# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - navigation [ref=e3]:
      - generic [ref=e5]:
        - generic [ref=e8]: Health Hub
        - generic [ref=e11]:
          - button "Admin" [ref=e12] [cursor=pointer]
          - button "Instructor" [ref=e13] [cursor=pointer]
          - button "Learner" [ref=e14] [cursor=pointer]
        - button "Sign Out" [ref=e16] [cursor=pointer]
    - generic [ref=e19]:
      - heading "Welcome back, Student!" [level=2] [ref=e20]
      - paragraph [ref=e21]: Continue your ECG learning journey
    - main [ref=e22]:
      - navigation [ref=e25]:
        - button "My Modules" [ref=e26] [cursor=pointer]:
          - generic [ref=e27] [cursor=pointer]:
            - img [ref=e28] [cursor=pointer]
            - text: My Modules
        - button "Progress" [active] [ref=e30] [cursor=pointer]:
          - generic [ref=e31] [cursor=pointer]:
            - img [ref=e32] [cursor=pointer]
            - text: Progress
        - button "Certificates" [ref=e35] [cursor=pointer]:
          - generic [ref=e36] [cursor=pointer]:
            - img [ref=e37] [cursor=pointer]
            - text: Certificates
  - alert [ref=e47]
```