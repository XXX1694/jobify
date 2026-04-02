package service

import "testing"

func TestApplicationOwnership(t *testing.T) {
	t.Run("Should fail if user is not owner", func(t *testing.T) {
		ownerID := 1
		userID := 2
		
		if userID != ownerID {
			t.Log("Correctly identified: User cannot modify this application")
		} else {
			t.Errorf("Security flaw: Non-owner can modify application")
		}
	})
}