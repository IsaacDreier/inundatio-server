const connectToDatabase = require('../database');
const Site = require('../models/SiteModel');
const fs = require('fs/promises');
const { isNumeric } = require('validator');

async function parseSiteFile(folder) {
  const contents = await fs.readFile(
    `./site_info/${folder}/inventory`,
    'utf-8'
  );
  const lines = contents.split('\n');
  lines.forEach(async (line) => {
    if (
      line[0] === '#' ||
      /^agency_cd/.test(line) ||
      /^[0-9]+s/.test(line) ||
      line === ''
    )
      return;
    const [
      agency_cd,
      site_no,
      station_nm,
      site_tp_cd,
      lat_va,
      long_va,
      dec_lat_va,
      dec_long_va,
      coord_meth_cd,
      coord_acy_cd,
      coord_datum_cd,
      dec_coord_datum_cd,
      district_cd,
      state_cd,
      county_cd,
      country_cd,
      land_net_ds,
      map_nm,
      map_scale_fc,
      alt_va,
      alt_meth_cd,
      alt_acy_va,
      alt_datum_cd,
      huc_cd,
      basin_cd,
      topo_cd,
      data_types_cd,
      instruments_cd,
      construction_dt,
      inventory_dt,
      drain_area_va,
      contrib_drain_area_va,
      tz_cd,
      local_time_fg,
      reliability_cd,
      gw_file_cd,
      nat_aqfr_cd,
      aqfr_cd,
      aqfr_type_cd,
      well_depth_va,
      hole_depth_va,
      depth_src_cd,
      project_no,
      rt_bol,
      peak_begin_date,
      peak_end_date,
      peak_count_nu,
      qw_begin_date,
      qw_end_date,
      qw_count_nu,
      gw_begin_date,
      gw_end_date,
      gw_count_nu,
      sv_begin_date,
      sv_end_date,
      sv_count_nu,
    ] = line.split('\t');
    if (
      site_no &&
      isNumeric(site_no) &&
      agency_cd &&
      station_nm &&
      dec_lat_va &&
      isNumeric(dec_lat_va) &&
      dec_long_va &&
      isNumeric(dec_long_va)
    ) {
      const site = {
        _id: site_no,
        agency: agency_cd,
        name: station_nm,
        type: site_tp_cd,
        latDec: dec_lat_va,
        longDec: dec_long_va,
        coordDatum: coord_datum_cd,
        district: district_cd,
        state: state_cd,
        county: county_cd,
        country: country_cd,
        altitude: alt_va,
        altDatum: alt_datum_cd,
      };
      try {
        await Site.create(site);
      } catch (err) {
        console.log(err);
      }
    }
  });
}

async function main() {
  await connectToDatabase();
  const folders = await fs.readdir('./site_info');
  folders.forEach(async (folder) => {
    if (folder != '.DS_Store') await parseSiteFile(folder);
  });
}

main();
