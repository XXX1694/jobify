package redis

import (
	"context"
	"encoding/json"
	"time"

	"github.com/redis/go-redis/v9"
)

const jobListCacheTTL = 10 * time.Minute

type JobCache struct {
	client *redis.Client
}

func NewJobCache(client *redis.Client) *JobCache {
	return &JobCache{client: client}
}

func (c *JobCache) Get(ctx context.Context, key string, dst interface{}) error {
	data, err := c.client.Get(ctx, key).Bytes()
	if err != nil {
		return err
	}
	return json.Unmarshal(data, dst)
}

func (c *JobCache) Set(ctx context.Context, key string, value interface{}) error {
	data, err := json.Marshal(value)
	if err != nil {
		return err
	}
	return c.client.Set(ctx, key, data, jobListCacheTTL).Err()
}

func (c *JobCache) Del(ctx context.Context, key string) error {
	return c.client.Del(ctx, key).Err()
}
