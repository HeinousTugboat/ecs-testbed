CREATE OR REPLACE FUNCTION add_random_points (integer)
RETURNS void as $$
DECLARE
	n ALIAS FOR $1;
BEGIN
	FOR i IN 1..n LOOP
		INSERT INTO points(x,y) VALUES
		(random() * 10, random() * 10);
	END LOOP;
END;
$$ LANGUAGE plpgsql;

DELETE FROM points;

DO $$ BEGIN
	PERFORM add_random_points(500);
END $$;

SELECT p.id, count(p2), sqrt(sum(power(p2.x - p.x, 2) + power(p2.y - p.y, 2)))/count(p2)
FROM points p, points p2
WHERE p.id != p2.id
AND power(p2.x - p.x, 2) + power(p2.y - p.y, 2) < power(1, 2)
GROUP BY p.id;
