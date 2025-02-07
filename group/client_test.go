package group

import (
	"bytes"
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"log"
	"reflect"
	"testing"

	"golang.org/x/crypto/bcrypt"
	"golang.org/x/crypto/pbkdf2"
)

var key1 = ""
var pw1 = Password{
	Type: "plain",
	Key:  &key1,
}
var key2 = "pass"
var pw2 = Password{
	Type: "plain",
	Key:  &key2,
}
var key3 = "fe499504e8f144693fae828e8e371d50e019d0e4c84994fa03f7f445bd8a570a"
var pw3 = Password{
	Type:       "pbkdf2",
	Hash:       "sha-256",
	Key:        &key3,
	Salt:       "bcc1717851030776",
	Iterations: 4096,
}
var key4 = "$2a$10$afOr2f33onT/nDFFyT3mbOq5FMSw1wWXfyTXQTBMbKvZpBkoD3Qwu"
var pw4 = Password{
	Type: "bcrypt",
	Key:  &key4,
}
var pw5 = Password{}
var pw6 = Password{
	Type: "bad",
}

func TestGood(t *testing.T) {
	if match, err := pw1.Match(""); err != nil || !match {
		t.Errorf("pw2 doesn't match (%v)", err)
	}
	if match, err := pw2.Match("pass"); err != nil || !match {
		t.Errorf("pw2 doesn't match (%v)", err)
	}
	if match, err := pw3.Match("pass"); err != nil || !match {
		t.Errorf("pw3 doesn't match (%v)", err)
	}
	if match, err := pw4.Match("pass"); err != nil || !match {
		t.Errorf("pw4 doesn't match (%v)", err)
	}
}

func TestBad(t *testing.T) {
	if match, err := pw2.Match("bad"); err != nil || match {
		t.Errorf("pw2 matches bad")
	}
	if match, err := pw2.Match("bad1"); err != nil || match {
		t.Errorf("pw2 matches bad1")
	}
	if match, err := pw3.Match("bad"); err != nil || match {
		t.Errorf("pw3 matches")
	}
	if match, err := pw4.Match("bad"); err != nil || match {
		t.Errorf("pw4 matches")
	}
	if match, err := pw5.Match(""); err != nil || match {
		t.Errorf("pw5 matches")
	}
	if match, err := pw5.Match("bad"); err != nil || match {
		t.Errorf("pw5 matches")
	}
	if match, err := pw6.Match("bad"); err == nil || match {
		t.Errorf("pw6 matches")
	}
}

func TestEmptyKey(t *testing.T) {
	for _, tpe := range []string{"plain", "pbkdf2", "bcrypt", "bad"} {
		pw := Password{Type: tpe}
		if match, err := pw.Match(""); err == nil || match {
			t.Errorf("empty password of type %v didn't error", tpe)
		}
	}

	pw := Password{}
	if match, err := pw.Match(""); err != nil || match {
		t.Errorf("empty password empty type matched")
	}
}

func TestJSON(t *testing.T) {
	plain, err := json.Marshal(pw2)
	if err != nil || string(plain) != `"pass"` {
		t.Errorf("Expected \"pass\", got %v", string(plain))
	}

	for _, pw := range []Password{pw1, pw2, pw3, pw4, pw5} {
		j, err := json.Marshal(pw)
		if err != nil {
			t.Fatalf("Marshal: %v", err)
		}
		if testing.Verbose() {
			log.Printf("%v", string(j))
		}
		var pw2 Password
		err = json.Unmarshal(j, &pw2)
		if err != nil {
			t.Errorf("Unmarshal: %v", err)
		} else if !reflect.DeepEqual(pw, pw2) {
			t.Errorf("Expected %v, got %v", pw, pw2)
		}
	}
}

func BenchmarkPBKDF2(b *testing.B) {
	for iters := 1024; iters <= 1024*1024; iters *= 2 {
		b.Run(fmt.Sprintf("%d", iters), func(b *testing.B) {
			pw := []byte("Password1234")
			salt := make([]byte, 8)
			for i := range salt {
				salt[i] = byte(i)
			}
			key := pbkdf2.Key(pw, salt, iters, 32, sha256.New)
			b.ResetTimer()
			for i := 0; i < b.N; i++ {
				k := pbkdf2.Key(pw, salt, iters, 32, sha256.New)
				if bytes.Compare(key, k) != 0 {
					b.Errorf("Key compare: mismatch")
				}
			}
		})
	}
}

func BenchmarkBCrypt(b *testing.B) {
	for cost := 4; cost <= 15; cost++ {
		b.Run(fmt.Sprintf("%d", cost), func(b *testing.B) {
			pw := []byte("Password1234")
			key, err := bcrypt.GenerateFromPassword(pw, cost)
			if err != nil {
				b.Fatalf("GenerateFromPassword: %v", err)
			}
			b.ResetTimer()
			for i := 0; i < b.N; i++ {
				err := bcrypt.CompareHashAndPassword(key, pw)
				if err != nil {
					b.Errorf(
						"CompareHashAndPassword: %v", err,
					)
				}
			}
		})
	}
}
