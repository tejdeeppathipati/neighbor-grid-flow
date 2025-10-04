-- Fix v_community_today view to include unserved_wh field
create or replace view v_community_today as
select
  c.microgrid_id,
  current_date as day,
  (select coalesce(sum(prod_wh),0) from rollup_daily_community r
     where r.microgrid_id = c.microgrid_id and r.day = current_date) as prod_wh,
  (select coalesce(sum(mg_used_wh),0) from rollup_daily_community r
     where r.microgrid_id = c.microgrid_id and r.day = current_date) as mg_used_wh,
  (select coalesce(sum(grid_import_wh),0) from rollup_daily_community r
     where r.microgrid_id = c.microgrid_id and r.day = current_date) as grid_import_wh,
  (select coalesce(sum(grid_export_wh),0) from rollup_daily_community r
     where r.microgrid_id = c.microgrid_id and r.day = current_date) as grid_export_wh,
  (select coalesce(sum(unserved_wh),0) from rollup_daily_community r
     where r.microgrid_id = c.microgrid_id and r.day = current_date) as unserved_wh
from tick_state_community c
group by c.microgrid_id;

